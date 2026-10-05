import { supabase } from './supabaseClient';
import { PlanItem, DateMemory, DatePhoto, CoupleUser } from './types';

// ==============================================================================
// 1. USUARIOS Y APODOS (MARCELO Y NICOLE)
// ==============================================================================

export async function fetchCoupleUsers(): Promise<{ marcelo?: CoupleUser; nicole?: CoupleUser }> {
  try {
    const { data, error } = await supabase
      .from('couple_users')
      .select('*')
      .order('user_slot', { ascending: true });

    if (error) {
      console.warn('Advertencia al consultar couple_users en Supabase:', error.message);
      return {};
    }

    const marcelo = data?.find((u: any) => u.user_slot === 1);
    const nicole = data?.find((u: any) => u.user_slot === 2);

    return {
      marcelo: marcelo
        ? {
            id: marcelo.id,
            user_slot: 1,
            username: marcelo.username,
            real_name: marcelo.real_name,
            nickname: marcelo.nickname || marcelo.real_name,
            color_theme: 'teal'
          }
        : undefined,
      nicole: nicole
        ? {
            id: nicole.id,
            user_slot: 2,
            username: nicole.username,
            real_name: nicole.real_name,
            nickname: nicole.nickname || nicole.real_name,
            color_theme: 'purple'
          }
        : undefined
    };
  } catch (err) {
    console.error('Error en fetchCoupleUsers:', err);
    return {};
  }
}

export async function updateCoupleNicknameInDB(userSlot: number, nickname: string): Promise<boolean> {
  try {
    const cleanNick = nickname.trim();
    // Intentar vía función RPC
    const { error: rpcErr } = await supabase.rpc('update_couple_nickname', {
      p_user_slot: userSlot,
      p_nickname: cleanNick
    });

    if (!rpcErr) return true;

    // Fallback directo sobre la tabla couple_users
    const { error: tableErr } = await supabase
      .from('couple_users')
      .update({ nickname: cleanNick, updated_at: new Date().toISOString() })
      .eq('user_slot', userSlot);

    if (tableErr) throw tableErr;
    return true;
  } catch (err) {
    console.error('Error al actualizar apodo en Supabase:', err);
    return false;
  }
}

export async function loginCoupleUser(username: string, password: string): Promise<CoupleUser | null> {
  try {
    const { data, error } = await supabase.rpc('login_couple_user', {
      p_username: username,
      p_password: password
    });

    if (error || !data || data.length === 0) {
      return null;
    }

    const u = data[0];
    return {
      id: u.id,
      user_slot: u.user_slot,
      username: u.username,
      real_name: u.real_name,
      nickname: u.nickname || u.real_name,
      color_theme: u.color_theme,
      display_name: u.display_name
    };
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    return null;
  }
}

export async function updateCouplePasswordInDB(userSlot: number, newPassword: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('update_couple_password', {
      p_user_slot: userSlot,
      p_new_password: newPassword
    });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    return false;
  }
}

// ==============================================================================
// 2. PLANES (BANCO DE IDEAS SIN FOTOS)
// ==============================================================================

export async function fetchPlansFromDB(): Promise<PlanItem[]> {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Advertencia al consultar plans en Supabase:', error.message);
      return [];
    }

    return (data || []).map((p: any) => ({
      id: p.id,
      title: p.title || 'Idea de cita',
      location_name: p.location_name || '',
      tentative_date: p.tentative_date || '',
      planning_notes: p.planning_notes || '',
      references: Array.isArray(p.references) ? p.references : [],
      checklist: Array.isArray(p.checklist) ? p.checklist : [],
      created_at: p.created_at
    }));
  } catch (err) {
    console.error('Error en fetchPlansFromDB:', err);
    return [];
  }
}

export async function upsertPlanInDB(plan: PlanItem, slot: number = 1): Promise<PlanItem> {
  const payload = {
    title: plan.title.trim(),
    location_name: plan.location_name?.trim() || '',
    tentative_date: plan.tentative_date?.trim() || '',
    planning_notes: plan.planning_notes?.trim() || '',
    references: plan.references || [],
    checklist: plan.checklist || [],
    status: 'pending',
    created_by_slot: slot,
    updated_at: new Date().toISOString()
  };

  // Si tiene un ID UUID válido de Supabase, hacemos update
  const isExistingUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(plan.id);

  if (isExistingUUID) {
    const { data, error } = await supabase
      .from('plans')
      .update(payload)
      .eq('id', plan.id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...plan,
      id: data.id,
      created_at: data.created_at
    };
  } else {
    // Es un plan nuevo
    const { data, error } = await supabase
      .from('plans')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return {
      ...plan,
      id: data.id,
      created_at: data.created_at
    };
  }
}

export async function deletePlanFromDB(planId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('plans').delete().eq('id', planId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error al borrar plan en Supabase:', err);
    return false;
  }
}

// ==============================================================================
// 3. CITAS (EN CURSO Y BITÁCORA SELLADA)
// ==============================================================================

export async function fetchDatesFromDB(): Promise<{
  memories: DateMemory[];
  activeOngoing: DateMemory | null;
}> {
  try {
    const { data, error } = await supabase
      .from('dates')
      .select('*, date_photos(*)')
      .order('date_number', { ascending: false });

    if (error) {
      console.warn('Advertencia al consultar dates en Supabase:', error.message);
      return { memories: [], activeOngoing: null };
    }

    const memories: DateMemory[] = [];
    let activeOngoing: DateMemory | null = null;

    (data || []).forEach((row: any) => {
      const photos: DatePhoto[] = (row.date_photos || [])
        .sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
        .map((p: any) => ({
          id: p.id,
          date_id: p.date_id,
          url: p.photo_url || p.url,
          caption: p.caption || '',
          secret_back: p.secret_back || '',
          rotation: p.rotation || '-2deg'
        }));

      const dateObj: DateMemory = {
        id: row.id,
        date_number: row.date_number,
        stamp_code: row.stamp_code || `CITA #${String(row.date_number).padStart(3, '0')}`,
        title: row.title || 'Nuestra cita',
        status: row.status || 'completed',
        location_name: row.location_name || '',
        scheduled_date: row.scheduled_date || '',
        gerbera_color: row.gerbera_color || 'purple',
        origin_plan_id: row.origin_plan_id,
        fromWishId: row.origin_plan_id,
        random_quote: row.random_quote || '',
        person1_liked: row.person1_liked || '',
        person2_liked: row.person2_liked || '',
        person1_nice_note: row.person1_nice_note || '',
        person2_nice_note: row.person2_nice_note || '',
        created_at: row.created_at,
        completed_at: row.completed_at,
        photos
      };

      if (row.status === 'ongoing') {
        if (!activeOngoing) activeOngoing = dateObj;
      } else {
        memories.push(dateObj);
      }
    });

    return { memories, activeOngoing };
  } catch (err) {
    console.error('Error en fetchDatesFromDB:', err);
    return { memories: [], activeOngoing: null };
  }
}

export async function createOngoingDateInDB(
  date: Partial<DateMemory>,
  slot: number = 1
): Promise<DateMemory> {
  const payload: any = {
    title: date.title?.trim() || 'Cita de Hoy',
    status: 'ongoing',
    location_name: date.location_name?.trim() || '',
    scheduled_date: date.scheduled_date || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    gerbera_color: date.gerbera_color || 'teal',
    created_by_slot: slot
  };

  if (date.fromWishId) {
    payload.origin_plan_id = date.fromWishId;
  }

  let { data, error } = await supabase
    .from('dates')
    .insert(payload)
    .select('*, date_photos(*)')
    .single();

  // Si falló por columna no encontrada antes de ejecutar la migración (código PGRST204)
  if (error && error.code === 'PGRST204') {
    console.warn('Reintentando insert de cita omitiendo columnas extras:', error.message);
    delete payload.created_by_slot;
    delete payload.gerbera_color;
    const retry = await supabase.from('dates').insert(payload).select('*, date_photos(*)').single();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.error('Error al crear cita en curso en Supabase:', error);
    throw error;
  }

  return {
    id: data.id,
    date_number: data.date_number,
    stamp_code: data.stamp_code || `CITA #${String(data.date_number).padStart(3, '0')}`,
    title: data.title,
    status: 'ongoing',
    location_name: data.location_name || '',
    scheduled_date: data.scheduled_date || '',
    gerbera_color: data.gerbera_color || 'teal',
    origin_plan_id: data.origin_plan_id,
    fromWishId: data.origin_plan_id,
    random_quote: '',
    person1_liked: '',
    person2_liked: '',
    person1_nice_note: '',
    person2_nice_note: '',
    photos: []
  };
}

export async function saveOngoingDateToBitacoraInDB(
  completedEntry: DateMemory,
  slot: number = 1
): Promise<DateMemory> {
  const isExistingUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(completedEntry.id);

  let targetId = completedEntry.id;
  let finalDateNumber = completedEntry.date_number;
  let finalStampCode = completedEntry.stamp_code;

  if (isExistingUUID) {
    // Actualizar registro existente a status 'completed'
    const { data: updatedDate, error: updateErr } = await supabase
      .from('dates')
      .update({
        title: completedEntry.title.trim() || 'Nuestra cita',
        status: 'completed',
        location_name: completedEntry.location_name || '',
        scheduled_date: completedEntry.scheduled_date || '',
        gerbera_color: completedEntry.gerbera_color || 'purple',
        random_quote: completedEntry.random_quote?.trim() || '',
        person1_liked: completedEntry.person1_liked?.trim() || '',
        person2_liked: completedEntry.person2_liked?.trim() || '',
        person1_nice_note: completedEntry.person1_nice_note?.trim() || '',
        person2_nice_note: completedEntry.person2_nice_note?.trim() || '',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', targetId)
      .select()
      .single();

    if (updateErr) throw updateErr;
    finalDateNumber = updatedDate.date_number;
    finalStampCode = updatedDate.stamp_code;
  } else {
    // Insertar registro nuevo completado
    const { data: insertedDate, error: insertErr } = await supabase
      .from('dates')
      .insert({
        title: completedEntry.title.trim() || 'Nuestra cita',
        status: 'completed',
        location_name: completedEntry.location_name || '',
        scheduled_date: completedEntry.scheduled_date || '',
        gerbera_color: completedEntry.gerbera_color || 'purple',
        origin_plan_id: completedEntry.fromWishId || null,
        random_quote: completedEntry.random_quote?.trim() || '',
        person1_liked: completedEntry.person1_liked?.trim() || '',
        person2_liked: completedEntry.person2_liked?.trim() || '',
        person1_nice_note: completedEntry.person1_nice_note?.trim() || '',
        person2_nice_note: completedEntry.person2_nice_note?.trim() || '',
        created_by_slot: slot,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertErr) throw insertErr;
    targetId = insertedDate.id;
    finalDateNumber = insertedDate.date_number;
    finalStampCode = insertedDate.stamp_code;
  }

  // Guardar las fotos en date_photos
  const savedPhotos: DatePhoto[] = [];
  if (completedEntry.photos && completedEntry.photos.length > 0) {
    for (let i = 0; i < completedEntry.photos.length; i++) {
      const p = completedEntry.photos[i];
      const photoPayload = {
        date_id: targetId,
        photo_url: p.url,
        caption: p.caption || '',
        secret_back: p.secret_back || '',
        rotation: p.rotation || '-2deg',
        order_index: i,
        uploaded_by_slot: slot
      };

      const isPhotoUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.id);

      if (isPhotoUUID) {
        const { data: updatedPhoto } = await supabase
          .from('date_photos')
          .update(photoPayload)
          .eq('id', p.id)
          .select()
          .single();
        if (updatedPhoto) {
          savedPhotos.push({
            id: updatedPhoto.id,
            date_id: targetId,
            url: updatedPhoto.photo_url,
            caption: updatedPhoto.caption,
            secret_back: updatedPhoto.secret_back,
            rotation: updatedPhoto.rotation
          });
        }
      } else {
        const { data: insertedPhoto, error: phErr } = await supabase
          .from('date_photos')
          .insert(photoPayload)
          .select()
          .single();

        if (!phErr && insertedPhoto) {
          savedPhotos.push({
            id: insertedPhoto.id,
            date_id: targetId,
            url: insertedPhoto.photo_url,
            caption: insertedPhoto.caption,
            secret_back: insertedPhoto.secret_back,
            rotation: insertedPhoto.rotation
          });
        }
      }
    }
  }

  // Si es una cita existente, eliminar de date_photos las fotos que hayan sido borradas
  if (isExistingUUID && savedPhotos.length > 0) {
    const validSavedUUIDs = savedPhotos
      .map((p) => p.id)
      .filter((id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
    if (validSavedUUIDs.length > 0) {
      try {
        await supabase
          .from('date_photos')
          .delete()
          .eq('date_id', targetId)
          .not('id', 'in', `(${validSavedUUIDs.join(',')})`);
      } catch (cleanErr) {
        console.warn('Advertencia al limpiar fotos eliminadas en DB:', cleanErr);
      }
    }
  }

  // Si provenía de un plan, eliminarlo de la lista de pendientes
  if (completedEntry.fromWishId) {
    await supabase.from('plans').delete().eq('id', completedEntry.fromWishId);
  }

  return {
    ...completedEntry,
    id: targetId,
    date_number: finalDateNumber,
    stamp_code: finalStampCode,
    photos: savedPhotos.length > 0 ? savedPhotos : completedEntry.photos
  };
}

export async function deleteMemoryFromDB(dateId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('dates').delete().eq('id', dateId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error al borrar memoria en Supabase:', err);
    return false;
  }
}

export async function addPhotoToOngoingDateInDB(
  dateId: string,
  photoUrl: string,
  caption: string = '',
  secretBack: string = '',
  slot: number = 1,
  orderIndex: number = 0
): Promise<DatePhoto> {
  const isExistingUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dateId);
  const rotation = orderIndex % 2 === 0 ? '-2deg' : '2deg';

  if (isExistingUUID) {
    try {
      const { data, error } = await supabase
        .from('date_photos')
        .insert({
          date_id: dateId,
          photo_url: photoUrl,
          caption: caption.trim(),
          secret_back: secretBack.trim(),
          rotation,
          order_index: orderIndex,
          uploaded_by_slot: slot
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          date_id: dateId,
          url: data.photo_url,
          caption: data.caption,
          secret_back: data.secret_back,
          rotation: data.rotation
        };
      }
    } catch (err) {
      console.warn('Advertencia al insertar foto en Supabase:', err);
    }
  }

  return {
    id: `p-${Date.now()}`,
    date_id: dateId,
    url: photoUrl,
    caption: caption.trim(),
    secret_back: secretBack.trim(),
    rotation
  };
}

export async function deletePhotoFromDB(photoId: string): Promise<boolean> {
  const isExistingUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(photoId);
  if (!isExistingUUID) return true;
  try {
    const { error } = await supabase.from('date_photos').delete().eq('id', photoId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error al borrar foto en Supabase:', err);
    return false;
  }
}

export async function updatePhotoCaptionInDB(photoId: string, caption: string): Promise<boolean> {
  const isExistingUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(photoId);
  if (!isExistingUUID) return true;
  try {
    const { error } = await supabase
      .from('date_photos')
      .update({ caption: caption.trim() })
      .eq('id', photoId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error al actualizar pie de foto en Supabase:', err);
    return false;
  }
}


