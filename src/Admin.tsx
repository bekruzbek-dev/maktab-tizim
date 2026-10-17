import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './Admin.css'
import './AdminGalleryEdit.css'
    type SchoolSettings = {
  id: number
  school_name: string
  slogan: string | null
  about_text: string | null
  students_count: number
  teachers_count: number
  classes_count: number
  experience_years: number
  school_image_url: string | null
  address: string | null
  legal_address: string | null
  location_type: string | null
  building_year: number | null
  building_condition: string | null
  renovation_year: number | null
  renovation_type: string | null
  capacity: number | null
  education_language: string | null
  shifts_count: number | null
  teachers_highest_category_count: number | null
  special_classrooms: string | null
  assembly_hall_condition: string | null
  sports_hall_condition: string | null
  library_condition: string | null
  cafeteria_condition: string | null
  phone: string | null
  email: string | null
  working_hours: string | null
  updated_at: string
}
type Leadership = {
  id: number
  full_name: string
  position: string
  image_url: string | null
  phone: string | null
  description: string | null
  created_at: string
}
type Achievement = {
  id: number
  title: string
  description: string | null
  achievement_date: string | null
  category: string | null
  image_url: string | null
  created_at: string
}
type News = {
  id: number
  title: string
  content: string
  image_url: string | null
  created_at: string
}
type GalleryImage = {
  id: number
  image_url: string
  title: string | null
  description: string | null
  created_at: string
}   
type SchoolEvent = {
  id: number;
  title: string;
  description: string | null;
  event_date: string | null;
  image_url: string | null;
  created_at: string;
};
function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [news, setNews] = useState<News[]>([])
  const [schoolSettings, setSchoolSettings] =
  useState<SchoolSettings | null>(null)
const [schoolImageLoading, setSchoolImageLoading] = useState(false)
const [schoolName, setSchoolName] = useState('')
const [schoolSlogan, setSchoolSlogan] = useState('')
const [schoolAbout, setSchoolAbout] = useState('')
const [studentsCount, setStudentsCount] = useState(0)
const [teachersCount, setTeachersCount] = useState(0)
const [classesCount, setClassesCount] = useState(0)
const [experienceYears, setExperienceYears] = useState(0)
  const [title, setTitle] = useState('')
  const [activeSection, setActiveSection] = useState('dashboard')
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
const [galleryTitle, setGalleryTitle] = useState('')
const [galleryDescription, setGalleryDescription] = useState('')
const [galleryFile, setGalleryFile] = useState<File | null>(null)
const [galleryLoading, setGalleryLoading] = useState(false)
const [editingGalleryId, setEditingGalleryId] = useState<number | null>(null)
const [editingGalleryTitle, setEditingGalleryTitle] = useState('')
const [editingGalleryDescription, setEditingGalleryDescription] = useState('')
const [editingGalleryFile, setEditingGalleryFile] = useState<File | null>(null)
const [leadership, setLeadership] = useState<Leadership[]>([])
const [leadershipName, setLeadershipName] = useState('')
const [leadershipPosition, setLeadershipPosition] = useState('')
const [leadershipPhone, setLeadershipPhone] = useState('')
const [leadershipDescription, setLeadershipDescription] = useState('')
const [leadershipFile, setLeadershipFile] = useState<File | null>(null)
const [leadershipLoading, setLeadershipLoading] = useState(false)
const [editingLeadership, setEditingLeadership] = useState<Leadership | null>(null)
const [leadershipEditFile, setLeadershipEditFile] = useState<File | null>(null)
const [achievements, setAchievements] = useState<Achievement[]>([])
const [achievementTitle, setAchievementTitle] = useState('')
const [achievementDescription, setAchievementDescription] = useState('')
const [achievementDate, setAchievementDate] = useState('')
const [achievementCategory, setAchievementCategory] = useState('')
const [achievementFile, setAchievementFile] = useState<File | null>(null)
const [achievementLoading, setAchievementLoading] = useState(false)
const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
const [achievementEditLoading, setAchievementEditLoading] = useState(false);
const [achievementEditImage, setAchievementEditImage] = useState<File | null>(null);
const [settingsEmail, setSettingsEmail] = useState('')
const [currentPassword, setCurrentPassword] = useState('')
const [newPassword, setNewPassword] = useState('')
const [confirmPassword, setConfirmPassword] = useState('')
const [settingsLoading, setSettingsLoading] = useState(false)
const [events, setEvents] = useState<SchoolEvent[]>([]);
const [eventTitle, setEventTitle] = useState("");
const [eventDescription, setEventDescription] = useState("");
const [eventDate, setEventDate] = useState("");
// @ts-ignore 
const [eventFile, setEventFile] = useState<File | null>(null);
const [eventLoading, setEventLoading] = useState(false);
const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);
const [eventEditFile, setEventEditFile] = useState<File | null>(null);
useEffect(() => {
  let mounted = true
  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!mounted) return
    setLoggedIn(!!session)
  }
  checkSession()
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (mounted) {
      setLoggedIn(!!session)
    }
  })
  return () => {
    mounted = false
    subscription.unsubscribe()
  }
}, [])
useEffect(() => {
  if (!loggedIn) return
  loadNews()
  loadSchoolSettings()
  loadGalleryImages()
  loadEvents()
  loadLeadership()
  loadAchievements()
  loadAccountSettings()
}, [loggedIn])
async function loadAchievements() {
  const { data, error } = await supabase
    .from('school_achievements')
    .select('id,title,description,achievement_date,category,image_url,created_at')
    .order('sort_order', { ascending: true })
    .limit(50)
  if (error) {
    setMessage(
      'Yutuqlarni yuklashda xato: ' +
        error.message
    )
    return
  }
  setAchievements(data || [])
}
async function loadEvents() {
  const { data, error } = await supabase
    .from("school_events")
    .select(
      "id,title,description,event_date,image_url,created_at"
    )
    .order("event_date", {
      ascending: true,
      nullsFirst: false,
    })
    .limit(50);
  if (error) {
    setMessage(
      "Tadbirlarni yuklashda xato: " + error.message
    );
    return;
  }
  setEvents(data || []);
}
function editEvent(event: SchoolEvent) {
  setEditingEvent({ ...event });
  setEventEditFile(null);
  setMessage("");
}

function cancelEventEdit() {
  setEditingEvent(null);
  setEventEditFile(null);
}

async function saveEventEdit() {
  if (!editingEvent) return;

  if (!editingEvent.title.trim()) {
    setMessage("Tadbir nomini kiriting!");
    return;
  }

  setEventLoading(true);
  setMessage("");

  try {
    let imageUrl = editingEvent.image_url;
    let uploadedStoragePath: string | null = null;

    if (eventEditFile) {
      const fileExtension = eventEditFile.name.split(".").pop() || "jpg";
      uploadedStoragePath = `events/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("news-images")
        .upload(uploadedStoragePath, eventEditFile);

      if (uploadError) {
        setMessage("Yangi tadbir rasmini yuklashda xato: " + uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("news-images")
        .getPublicUrl(uploadedStoragePath);
      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from("school_events")
      .update({
        title: editingEvent.title.trim(),
        description: editingEvent.description?.trim() || null,
        event_date: editingEvent.event_date || null,
        image_url: imageUrl,
      })
      .eq("id", editingEvent.id);

    if (error) {
      if (uploadedStoragePath) {
        await supabase.storage
          .from("news-images")
          .remove([uploadedStoragePath]);
      }
      setMessage("Tadbirni tahrirlashda xato: " + error.message);
      return;
    }

    if (uploadedStoragePath && editingEvent.image_url) {
      const marker = "/news-images/";
      const markerIndex = editingEvent.image_url.indexOf(marker);

      if (markerIndex !== -1) {
        const oldStoragePath = editingEvent.image_url.substring(
          markerIndex + marker.length
        );
        await supabase.storage
          .from("news-images")
          .remove([oldStoragePath]);
      }
    }

    await loadEvents();
    cancelEventEdit();
    setMessage("Tadbir muvaffaqiyatli tahrirlandi! ✅");
  } finally {
    setEventLoading(false);
  }
}
async function deleteEvent(event: SchoolEvent) {
  const confirmed = window.confirm(
    `"${event.title}" tadbirini o‘chirmoqchimisiz?`
  );
  if (!confirmed) return;
  setEventLoading(true);
  setMessage("");
  try {
    if (event.image_url) {
      const marker = "/news-images/";
      const index =
        event.image_url.indexOf(marker);
      if (index !== -1) {
        const storagePath =
          event.image_url.substring(
            index + marker.length
          );
        await supabase.storage
          .from("news-images")
          .remove([storagePath]);
      }
    }
    const { error } = await supabase
      .from("school_events")
      .delete()
      .eq("id", event.id);
    if (error) {
      setMessage(
        "Tadbirni o‘chirishda xato: " +
          error.message
      );
      return;
    }
    await loadEvents();
    setMessage(
      "Tadbir muvaffaqiyatli o‘chirildi! 🗑️"
    );
  } finally {
    setEventLoading(false);
  }
}
async function loadAccountSettings() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user?.email) {
    setSettingsEmail(user.email)
  }
}
async function updateAdminAccount() {
  setSettingsLoading(true)
  setMessage('')
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setMessage('Admin akkaunti topilmadi!')
      return
    }
    /* PAROLNI TEKSHIRISH */
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        setMessage('Eski parolni kiriting!')
        return
      }
      if (newPassword.length < 6) {
        setMessage(
          'Yangi parol kamida 6 ta belgidan iborat bo‘lishi kerak!'
        )
        return
      }
      if (newPassword !== confirmPassword) {
        setMessage('Yangi parollar bir xil emas!')
        return
      }
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: user.email!,
          password: currentPassword,
        })
      if (loginError) {
        setMessage('Eski parol noto‘g‘ri!')
        return
      }
    }
    /* EMAIL + PAROLNI YANGILASH */
    const updates: {
      email?: string
      password?: string
    } = {}
    if (
      settingsEmail.trim() &&
      settingsEmail.trim() !== user.email
    ) {
      updates.email = settingsEmail.trim()
    }
    if (newPassword) {
      updates.password = newPassword
    }
    if (Object.keys(updates).length === 0) {
      setMessage('O‘zgartirish uchun maʼlumot kiriting!')
      return
    }
    const { error } =
      await supabase.auth.updateUser(updates)
    if (error) {
      setMessage(
        'Maʼlumotlarni yangilashda xato: ' +
          error.message
      )
      return
    }
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    if (updates.email) {
      setMessage(
        'Email yangilandi. Yangi email manzilingizni tasdiqlang. 📧'
      )
    } else {
      setMessage(
        'Admin paroli muvaffaqiyatli yangilandi! 🔐'
      )
    }
  } finally {
    setSettingsLoading(false)
  }
}
async function uploadAchievement() {
  if (!achievementTitle.trim()) {
    setMessage('Yutuq nomini kiriting!')
    return
  }
  setAchievementLoading(true)
  setMessage('')
  try {
    let imageUrl: string | null = null
    if (achievementFile) {
      const fileExt = achievementFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}.${fileExt}`
      const filePath = `achievements/${fileName}`
      const { error: uploadError } =
        await supabase.storage
          .from('news-images')
          .upload(filePath, achievementFile)
      if (uploadError) {
        setMessage(
          'Yutuq rasmini yuklashda xato: ' +
            uploadError.message
        )
        return
      }
      const { data } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath)
      imageUrl = data.publicUrl
    }
    const { error } = await supabase
      .from('school_achievements')
      .insert({
        title: achievementTitle.trim(),
        description:
          achievementDescription.trim() || null,
        achievement_date:
          achievementDate || null,
        category:
          achievementCategory.trim() || null,
        image_url: imageUrl,
      })
    if (error) {
      setMessage(
        'Yutuqni saqlashda xato: ' +
          error.message
      )
      return
    }
    setAchievementTitle('')
    setAchievementDescription('')
    setAchievementDate('')
    setAchievementCategory('')
    setAchievementFile(null)
    await loadAchievements()
    setMessage(
      'Yutuq muvaffaqiyatli qo‘shildi! 🏆'
    )
  } finally {
    setAchievementLoading(false)
  }
}
function editAchievement(achievement: Achievement) {
  setEditingAchievement({ ...achievement })
  setAchievementEditImage(null)
  setMessage('')
}

function cancelAchievementEdit() {
  setEditingAchievement(null)
  setAchievementEditImage(null)
}

async function saveAchievementEdit() {
  if (!editingAchievement) return

  if (!editingAchievement.title.trim()) {
    setMessage('Yutuq nomini kiriting!')
    return
  }

  setAchievementEditLoading(true)
  setMessage('')

  try {
    let imageUrl = editingAchievement.image_url
    let uploadedStoragePath: string | null = null

    if (achievementEditImage) {
      const fileExtension = achievementEditImage.name.split('.').pop() || 'jpg'
      uploadedStoragePath = `achievements/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}.${fileExtension}`

      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(uploadedStoragePath, achievementEditImage)

      if (uploadError) {
        setMessage('Yangi yutuq rasmini yuklashda xato: ' + uploadError.message)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('news-images')
        .getPublicUrl(uploadedStoragePath)
      imageUrl = publicUrlData.publicUrl
    }

    const { error } = await supabase
      .from('school_achievements')
      .update({
        title: editingAchievement.title.trim(),
        description: editingAchievement.description?.trim() || null,
        achievement_date: editingAchievement.achievement_date || null,
        category: editingAchievement.category?.trim() || null,
        image_url: imageUrl,
      })
      .eq('id', editingAchievement.id)

    if (error) {
      if (uploadedStoragePath) {
        await supabase.storage
          .from('news-images')
          .remove([uploadedStoragePath])
      }
      setMessage('Yutuqni tahrirlashda xato: ' + error.message)
      return
    }

    if (uploadedStoragePath && editingAchievement.image_url) {
      const marker = '/news-images/'
      const markerIndex = editingAchievement.image_url.indexOf(marker)

      if (markerIndex !== -1) {
        const oldStoragePath = editingAchievement.image_url.substring(
          markerIndex + marker.length
        )
        await supabase.storage
          .from('news-images')
          .remove([oldStoragePath])
      }
    }

    await loadAchievements()
    cancelAchievementEdit()
    setMessage('Yutuq muvaffaqiyatli tahrirlandi! ✅')
  } finally {
    setAchievementEditLoading(false)
  }
}
async function deleteAchievement(
  achievement: Achievement
) {
  const confirmed = window.confirm(
    `"${achievement.title}" yutug‘ini o‘chirmoqchimisiz?`
  )
  if (!confirmed) return
  setAchievementLoading(true)
  setMessage('')
  try {
    if (achievement.image_url) {
      const marker = '/news-images/'
      const index =
        achievement.image_url.indexOf(marker)
      if (index !== -1) {
        const storagePath =
          achievement.image_url.substring(
            index + marker.length
          )
        const { error: storageError } =
          await supabase.storage
            .from('news-images')
            .remove([storagePath])
        if (storageError) {
          setMessage(
            'Yutuq rasmini o‘chirishda xato: ' +
              storageError.message
          )
          return
        }
      }
    }
    const { error } = await supabase
      .from('school_achievements')
      .delete()
      .eq('id', achievement.id)
    if (error) {
      setMessage(
        'Yutuqni o‘chirishda xato: ' +
          error.message
      )
      return
    }
    await loadAchievements()
    setMessage(
      'Yutuq muvaffaqiyatli o‘chirildi! 🗑️'
    )
  } finally {
    setAchievementLoading(false)
  }
}
async function loadGalleryImages() {
  const { data, error } = await supabase
    .from('school_gallery')
    .select('id,image_url,title,description,created_at')
    .order('sort_order', { ascending: true })
    .limit(40)
  if (error) {
    setMessage('Rasmlarni yuklashda xato: ' + error.message)
    return
  }
  setGalleryImages(data || [])
}
async function uploadGalleryImage() {
  if (!galleryFile) {
    setMessage('Avval rasm tanlang!')
    return
  }
  setGalleryLoading(true)
  setMessage('')
  try {
    const fileExt = galleryFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`
    const filePath = `gallery/${fileName}`
    const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(filePath, galleryFile)
    if (uploadError) {
      setMessage(
        'Rasmni yuklashda xato: ' +
          uploadError.message
      )
      return
    }
    const { data: publicUrlData } = supabase.storage
      .from('news-images')
      .getPublicUrl(filePath)
    const imageUrl = publicUrlData.publicUrl
    const { error: insertError } = await supabase
      .from('school_gallery')
      .insert({
        image_url: imageUrl,
        title: galleryTitle.trim() || '7-Maktab',
        description: galleryDescription.trim() || null,
      })
    if (insertError) {
      setMessage(
        'Galereyaga saqlashda xato: ' +
          insertError.message
      )
      return
    }
    setGalleryTitle('')
    setGalleryDescription('')
    setGalleryFile(null)
    await loadGalleryImages()
    setMessage(
      'Rasm muvaffaqiyatli yuklandi! ✅'
    )
  } finally {
    setGalleryLoading(false)
  }
}
function editGalleryImage(image: GalleryImage) {
  setEditingGalleryId(image.id)
  setEditingGalleryTitle(image.title || '')
  setEditingGalleryDescription(image.description || '')
  setEditingGalleryFile(null)
  setMessage('')
}
function cancelGalleryEdit() {
  setEditingGalleryId(null)
  setEditingGalleryTitle('')
  setEditingGalleryDescription('')
  setEditingGalleryFile(null)
}
async function saveGalleryImageEdit() {
  if (editingGalleryId === null) return
  setGalleryLoading(true)
  setMessage('')
  try {
    const currentImage = galleryImages.find(
      (image) => image.id === editingGalleryId
    )
    let newImageUrl: string | null = null
    let uploadedStoragePath: string | null = null
    if (editingGalleryFile) {
      const fileExtension = editingGalleryFile.name.split('.').pop() || 'jpg'
      uploadedStoragePath = `gallery/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}.${fileExtension}`
      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(uploadedStoragePath, editingGalleryFile)
      if (uploadError) {
        setMessage('Yangi rasmni yuklashda xato: ' + uploadError.message)
        return
      }
      const { data: publicUrlData } = supabase.storage
        .from('news-images')
        .getPublicUrl(uploadedStoragePath)
      newImageUrl = publicUrlData.publicUrl
    }
    const updates: {
      title: string
      description: string | null
      image_url?: string
    } = {
      title: editingGalleryTitle.trim() || '7-Maktab',
      description: editingGalleryDescription.trim() || null,
    }
    if (newImageUrl) {
      updates.image_url = newImageUrl
    }
    const { error } = await supabase
      .from('school_gallery')
      .update(updates)
      .eq('id', editingGalleryId)
    if (error) {
      if (uploadedStoragePath) {
        await supabase.storage
          .from('news-images')
          .remove([uploadedStoragePath])
      }
      setMessage('Galereyani tahrirlashda xato: ' + error.message)
      return
    }
    if (newImageUrl && currentImage?.image_url) {
      const marker = '/news-images/'
      const markerIndex = currentImage.image_url.indexOf(marker)
      if (markerIndex !== -1) {
        const oldStoragePath = currentImage.image_url.substring(
          markerIndex + marker.length
        )
        await supabase.storage
          .from('news-images')
          .remove([oldStoragePath])
      }
    }
    await loadGalleryImages()
    cancelGalleryEdit()
    setMessage('Galereya rasmi va ma’lumotlari saqlandi! ✅')
  } finally {
    setGalleryLoading(false)
  }
}
async function loadLeadership() {
  const { data, error } = await supabase
    .from('school_leadership')
    .select('id,full_name,position,image_url,phone,description,created_at')
    .order('sort_order', { ascending: true })
    .limit(20)
  if (error) {
    setMessage(
      'Rahbariyatni yuklashda xato: ' +
        error.message
    )
    return
  }
  setLeadership(data || [])
}
async function deleteLeadership(person: Leadership) {
  const confirmed = window.confirm(
    `"${person.full_name}"ni o‘chirmoqchimisiz?`
  )
  if (!confirmed) return
  setLeadershipLoading(true)
  setMessage('')
  try {
    // Storage'dagi rasmni o‘chirish
    if (person.image_url) {
      const marker = '/news-images/'
      const markerIndex = person.image_url.indexOf(marker)
      if (markerIndex !== -1) {
        const storagePath = person.image_url.substring(
          markerIndex + marker.length
        )
        const { error: storageError } = await supabase.storage
          .from('news-images')
          .remove([storagePath])
        if (storageError) {
          setMessage(
            'Rahbar rasmini o‘chirishda xato: ' +
              storageError.message
          )
          return
        }
      }
    }
    // Database'dan o‘chirish
    const { error: databaseError } = await supabase
      .from('school_leadership')
      .delete()
      .eq('id', person.id)
    if (databaseError) {
      setMessage(
        'Rahbariyat maʼlumotini o‘chirishda xato: ' +
          databaseError.message
      )
      return
    }
    await loadLeadership()
    setMessage('Rahbariyat aʼzosi muvaffaqiyatli o‘chirildi! ✅')
  } finally {
    setLeadershipLoading(false)
  }
}
function editLeadership(person: Leadership) {
  setEditingLeadership({ ...person })
  setLeadershipEditFile(null)
  setMessage('')
}
function cancelLeadershipEdit() {
  setEditingLeadership(null)
  setLeadershipEditFile(null)
}
async function saveLeadershipEdit() {
  if (!editingLeadership) return
  if (!editingLeadership.full_name.trim() || !editingLeadership.position.trim()) {
    setMessage('F.I.Sh. va lavozim bo‘sh bo‘lmasligi kerak!')
    return
  }
  setLeadershipLoading(true)
  setMessage('')
  let uploadedStoragePath = ''
  try {
    let imageUrl = editingLeadership.image_url
    if (leadershipEditFile) {
      const fileExt = leadershipEditFile.name.split('.').pop() || 'jpg'
      uploadedStoragePath = `leadership/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(uploadedStoragePath, leadershipEditFile)
      if (uploadError) {
        setMessage('Rahbar rasmini yuklashda xato: ' + uploadError.message)
        return
      }
      const { data: publicUrlData } = supabase.storage
        .from('news-images')
        .getPublicUrl(uploadedStoragePath)
      imageUrl = publicUrlData.publicUrl
    }
    const { error } = await supabase
      .from('school_leadership')
      .update({
        full_name: editingLeadership.full_name.trim(),
        position: editingLeadership.position.trim(),
        phone: editingLeadership.phone?.trim() || null,
        description: editingLeadership.description?.trim() || null,
        image_url: imageUrl || null,
      })
      .eq('id', editingLeadership.id)
    if (error) {
      if (uploadedStoragePath) {
        await supabase.storage.from('news-images').remove([uploadedStoragePath])
      }
      setMessage('Rahbarni tahrirlashda xato: ' + error.message)
      return
    }
    if (uploadedStoragePath && editingLeadership.image_url) {
      const marker = '/news-images/'
      const markerIndex = editingLeadership.image_url.indexOf(marker)
      if (markerIndex !== -1) {
        const oldStoragePath = editingLeadership.image_url.substring(markerIndex + marker.length)
        await supabase.storage.from('news-images').remove([oldStoragePath])
      }
    }
    await loadLeadership()
    cancelLeadershipEdit()
    setMessage('Rahbar maʼlumotlari yangilandi! ✅')
  } finally {
    setLeadershipLoading(false)
  }
}
async function deleteGalleryImage(image: GalleryImage) {
  const confirmed = window.confirm(
    `"${image.title || 'Bu rasm'}"ni o‘chirmoqchimisiz?`
  )
  if (!confirmed) return
  setGalleryLoading(true)
  setMessage('')
  try {
    // 1. Public URL ichidan Storage pathni olish
    const marker = '/news-images/'
    const markerIndex = image.image_url.indexOf(marker)
    if (markerIndex !== -1) {
      const storagePath = image.image_url.substring(
        markerIndex + marker.length
      )
      // 2. Storage'dan rasmni o‘chirish
      const { error: storageError } = await supabase.storage
        .from('news-images')
        .remove([storagePath])
      if (storageError) {
        setMessage(
          'Storage rasmini o‘chirishda xato: ' +
            storageError.message
        )
        return
      }
    }
    // 3. Database'dan rasm yozuvini o‘chirish
    const { error: databaseError } = await supabase
      .from('school_gallery')
      .delete()
      .eq('id', image.id)
   if (databaseError) {
  setMessage(
    `Ma'lumotlar bazasidan o'chirishda xato: ${databaseError.message}`
  )
  return
}
    // 4. Galereyani yangilash
    await loadGalleryImages()
    setMessage('Rasm muvaffaqiyatli o‘chirildi! ✅')
  } finally {
    setGalleryLoading(false)
  }
}
async function uploadSchoolImage(file: File) {
  if (!schoolSettings) {
    setMessage("Maktab maʼlumotlari topilmadi!")
    return
  }
  // Faqat rasmlarni qabul qilish
  if (!file.type.startsWith("image/")) {
    setMessage("Iltimos, faqat rasm faylini tanlang.")
    return
  }
  // 5 MB dan katta rasmni qabul qilmaymiz
  if (file.size > 5 * 1024 * 1024) {
    setMessage("Rasm hajmi 5 MB dan oshmasligi kerak.")
    return
  }
  setSchoolImageLoading(true)
  setMessage("Rasm yuklanmoqda...")
  try {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `school-${Date.now()}.${ext}`
    const filePath = `school/${fileName}`
    // 1. Storage'ga yuklash
    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type,
      })
    if (uploadError) {
      console.error(uploadError)
      setMessage(
        "Maktab rasmini yuklashda xato: " +
          uploadError.message
      )
      return
    }
    // 2. Public URL olish
    const { data } = supabase.storage
      .from("news-images")
      .getPublicUrl(filePath)
    const imageUrl = data.publicUrl
    // 3. Bazaga URL saqlash
    const { data: updatedData, error: updateError } =
      await supabase
        .from("school_settings")
        .update({
          school_image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", schoolSettings.id)
        .select()
        .single()
    if (updateError) {
      console.error(updateError)
      // Bazaga yozilmasa, yuklangan rasmni ham o‘chiramiz
      await supabase.storage
        .from("news-images")
        .remove([filePath])
      setMessage(
        "Rasmni bazaga saqlashda xato: " +
          updateError.message
      )
      return
    }
    // 4. Admin state'ini yangilash
    setSchoolSettings(updatedData)
    setMessage(
      "Bosh sahifa rasmi muvaffaqiyatli almashtirildi! ✅"
    )
  } catch (error) {
    console.error(error)
    setMessage(
      "Rasmni yuklashda kutilmagan xato yuz berdi."
    )
  } finally {
    setSchoolImageLoading(false)
  }
}
async function deleteSchoolImage() {
  if (!schoolSettings?.school_image_url) {
    return
  }
  const confirmed = window.confirm(
    "Bosh sahifa rasmini o‘chirmoqchimisiz?"
  )
  if (!confirmed) {
    return
  }
  setSchoolImageLoading(true)
  setMessage("Rasm o‘chirilmoqda...")
  try {
    const imageUrl = schoolSettings.school_image_url
    const marker = "/news-images/"
    const index = imageUrl.indexOf(marker)
    // Storage'dan rasmni o‘chirish
    if (index !== -1) {
      const storagePath = imageUrl.substring(
        index + marker.length
      )
      const { error: storageError } =
        await supabase.storage
          .from("news-images")
          .remove([storagePath])
      if (storageError) {
        console.error(storageError)
        setMessage(
          "Storage rasmini o‘chirishda xato: " +
            storageError.message
        )
        return
      }
    }
    // Database'dan URL'ni o‘chirish
    const { data, error } = await supabase
      .from("school_settings")
      .update({
        school_image_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", schoolSettings.id)
      .select()
      .single()
    if (error) {
      console.error(error)
      setMessage(
        "Rasm maʼlumotini o‘chirishda xato: " +
          error.message
      )
      return
    }
    setSchoolSettings(data)
    setMessage(
      "Bosh sahifa rasmi o‘chirildi! ✅"
    )
  } catch (error) {
    console.error(error)
    setMessage(
      "Rasmni o‘chirishda xato yuz berdi."
    )
  } finally {
    setSchoolImageLoading(false)
  }
}
function updateSchoolProfile<K extends keyof SchoolSettings>(
  field: K,
  value: SchoolSettings[K]
) {
  setSchoolSettings((current) =>
    current ? { ...current, [field]: value } : current
  )
}
async function saveSchoolSettings() {
  setMessage('')
  if (!schoolSettings) {
    setMessage('Maktab maʼlumotlari topilmadi!')
    return
  }
  const { data, error } = await supabase
    .from('school_settings')
    .update({
      school_name: schoolName.trim(),
      slogan: schoolSlogan.trim(),
      about_text: schoolAbout.trim(),
      students_count: studentsCount,
      teachers_count: teachersCount,
      classes_count: classesCount,
      experience_years: experienceYears,
      legal_address: schoolSettings.legal_address?.trim() || null,
      location_type: schoolSettings.location_type?.trim() || null,
      building_year: schoolSettings.building_year,
      building_condition: schoolSettings.building_condition?.trim() || null,
      renovation_year: schoolSettings.renovation_year,
      renovation_type: schoolSettings.renovation_type?.trim() || null,
      capacity: schoolSettings.capacity,
      education_language: schoolSettings.education_language?.trim() || null,
      shifts_count: schoolSettings.shifts_count,
      teachers_highest_category_count: schoolSettings.teachers_highest_category_count,
      special_classrooms: schoolSettings.special_classrooms?.trim() || null,
      assembly_hall_condition: schoolSettings.assembly_hall_condition?.trim() || null,
      sports_hall_condition: schoolSettings.sports_hall_condition?.trim() || null,
      library_condition: schoolSettings.library_condition?.trim() || null,
      cafeteria_condition: schoolSettings.cafeteria_condition?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', schoolSettings.id)
    .select()
    .single()
  if (error) {
    console.error('School settings save error:', error)
    setMessage('Saqlashda xato: ' + error.message)
    return
  }
  setSchoolSettings(data)
  setMessage(
    'Maktab maʼlumotlari muvaffaqiyatli saqlandi! ✅'
  )
}
async function login() {
  setMessage('')
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    setMessage('Email yoki parol noto‘g‘ri!')
    return
  }
  // Supabase sessionni o‘zi saqlaydi.
  // onAuthStateChange loggedIn ni true qiladi.
}
  async function logout() {
    await supabase.auth.signOut()
    setLoggedIn(false)
  }
  async function loadSchoolSettings() {
  const { data, error } = await supabase
    .from('school_settings')
    .select('id,school_name,slogan,about_text,students_count,teachers_count,classes_count,experience_years,school_image_url,address,legal_address,location_type,building_year,building_condition,renovation_year,renovation_type,capacity,education_language,shifts_count,teachers_highest_category_count,special_classrooms,assembly_hall_condition,sports_hall_condition,library_condition,cafeteria_condition,phone,email,working_hours,updated_at')
    .limit(1)
    .single()
  if (error) {
    setMessage('Maktab maʼlumotlarini yuklashda xato: ' + error.message)
    return
  }
  if (!data) return
  setSchoolSettings(data)
  setSchoolName(data.school_name || '')
  setSchoolSlogan(data.slogan || '')
  setSchoolAbout(data.about_text || '')
  setStudentsCount(data.students_count || 0)
  setTeachersCount(data.teachers_count || 0)
  setClassesCount(data.classes_count || 0)
  setExperienceYears(data.experience_years || 0)
}
  async function loadNews() {
    const { data, error } = await supabase
      .from('news')
      .select('id,title,content,image_url,created_at')
      .order('sort_order', { ascending: true })
      .limit(50)
    if (error) {
      setMessage(error.message)
      return
    }
    setNews(data || [])
  }
  function editNews(item: News) {
    setEditingId(item.id)
    setTitle(item.title)
    setContent(item.content)
    setMessage('')
  }
  async function saveNews() {
    setMessage('')
    if (!title.trim() || !content.trim()) {
      setMessage('Sarlavha va matnni kiriting!')
      return
    }
    let imageUrl: string | null = null
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(fileName, imageFile)
      if (uploadError) {
        setMessage('Rasm yuklashda xato: ' + uploadError.message)
        return
      }
      const { data } = supabase.storage
        .from('news-images')
        .getPublicUrl(fileName)
      imageUrl = data.publicUrl
    }
    if (editingId !== null) {
      const { error } = await supabase
        .from('news')
        .update({
          title: title.trim(),
          content: content.trim(),
          ...(imageUrl ? { image_url: imageUrl } : {}),
        })
        .eq('id', editingId)
      if (error) {
        setMessage('Tahrirlashda xato: ' + error.message)
        return
      }
      setEditingId(null)
      setTitle('')
      setContent('')
      setImageFile(null)
      setMessage('Yangilik tahrirlandi! ✅')
      await loadNews()
      return
    }
    const { error } = await supabase
      .from('news')
      .insert({
        title: title.trim(),
        content: content.trim(),
        image_url: imageUrl,
      })
    if (error) {
      setMessage('Xato: ' + error.message)
      return
    }
    setTitle('')
    setContent('')
    setImageFile(null)
    setMessage('Yangilik muvaffaqiyatli qo‘shildi! ✅')
    await loadNews()
  }
  async function deleteNews(id: number) {
    const confirmed = window.confirm(
      'Bu yangilikni o‘chirishni xohlaysizmi?',
    )
    if (!confirmed) return
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)
    if (error) {
      setMessage('O‘chirishda xato: ' + error.message)
      return
    }
    setMessage('Yangilik o‘chirildi! ✅')
    await loadNews()
  }
  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>7-MAKTAB</h1>
          <h2>🔐 Administrator paneli</h2>
          <input
            className="admin-input"
            type="email"
            id="admin-email"
            name="email"
            autoComplete="username"
            aria-label="Admin email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="admin-input"
            type="password"
            id="admin-password"
            name="password"
            autoComplete="current-password"
            aria-label="Admin paroli"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="admin-button"
            style={{ width: '100%' }}
            onClick={login}
          >
            🔑 Kirish
          </button>
          {message && (
            <div className="admin-message" style={{ marginTop: 15 }}>
              {message}
            </div>
          )}
        </div>
      </div>
    )
  }
  const addEvent = async () => {
  if (!eventTitle.trim()) {
    setMessage("Tadbir nomini kiriting");
    return;
  }
  setEventLoading(true);
  setMessage("");
  const { error } = await supabase
    .from("school_events")
    .insert({
      title: eventTitle.trim(),
      description: eventDescription.trim(),
      event_date: eventDate || null,
    });
  if (error) {
    console.error(error);
    setMessage("Tadbirni saqlashda xatolik: " + error.message);
  } else {
    setMessage("Tadbir muvaffaqiyatli qo‘shildi");
    setEventTitle("");
    setEventDescription("");
    setEventDate("");
  }
  setEventLoading(false);
};
 return (
  <div className="admin-layout">
    {/* SIDEBAR */}
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <div className="school-icon">🏫</div>
        <div>
          <strong>7-MAKTAB</strong>
          <span>Admin Panel</span>
        </div>
      </div>
<nav className="sidebar-menu" aria-label="Admin bo‘limlari">
  <a
    href="#dashboard"
    className={activeSection === 'dashboard' ? 'active' : ''}
    onClick={() => setActiveSection('dashboard')}
  >
    📊 <span>Boshqaruv paneli</span>
  </a>
  <a
    href="#news"
    className={activeSection === 'news' ? 'active' : ''}
    onClick={() => setActiveSection('news')}
  >
    📰 <span>Yangiliklar</span>
  </a>
<a
  href="#events"
  className={
    activeSection === "events"
      ? "active"
      : ""
  }
  onClick={() => setActiveSection("events")}
>
  📅 <span>Tadbirlar</span>
</a>
  <a
    href="#images"
    className={activeSection === 'images' ? 'active' : ''}
    onClick={() => setActiveSection('images')}
  >
    🖼️ <span>Rasmlar</span>
  </a>
  <a
    href="#school"
    className={activeSection === 'school' ? 'active' : ''}
    onClick={() => setActiveSection('school')}
  >
    🏫 <span>Maktab haqida</span>
  </a>
  <a
    href="#leadership"
    className={activeSection === 'leadership' ? 'active' : ''}
    onClick={() => setActiveSection('leadership')}
  >
    👨‍💼 <span>Rahbariyat</span>
  </a>
 
<a
  href="#achievements"
  className={
    activeSection === 'achievements'
      ? 'active'
      : ''
  }
  onClick={() =>
    setActiveSection('achievements')
  }
>
  🏆 <span>Yutuqlar</span>
</a>
  <a
    href="#contact"
    className={activeSection === 'contact' ? 'active' : ''}
    onClick={() => setActiveSection('contact')}
  >
    📞 <span>Aloqa</span>
  </a>
  <a
    href="#settings"
    className={activeSection === 'settings' ? 'active' : ''}
    onClick={() => setActiveSection('settings')}
  >
    ⚙️ <span>Sozlamalar</span>
  </a>
</nav>
      <div className="sidebar-bottom">
        <button type="button" onClick={logout} aria-label="Admin panelidan chiqish">
          🚪 Chiqish
        </button>
      </div>
    </aside>
    {/* MAIN */}
    <main className="admin-main">
      <div className="admin-topbar">
        <div>
          <h1>Dashboard</h1>
          <p>7-maktab boshqaruv paneli</p>
        </div>
  
        <div className="admin-user" aria-label="Joriy foydalanuvchi: Administrator">
          👤 Administrator
        </div>
      </div>
      {/* STATISTICS */}
      <section className="dashboard-stats" id="dashboard">
        <div className="stat-card">
          <div className="stat-icon">📰</div>
          <div>
            <span>Jami yangiliklar</span>
            <strong>{news.length}</strong>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🖼️</div>
          <div>
            <span>Rasmli yangiliklar</span>
            <strong>
              {news.filter((item) => item.image_url).length}
            </strong>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏫</div>
          <div>
            <span>Maktab</span>
            <strong>7</strong>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div>
            <span>Tizim</span>
            <strong>Faol</strong>
          </div>
        </div>
      </section>
      {/* ADD NEWS */}
      <section className="admin-card" id="news">
        <h2>
          {editingId !== null
            ? '✏️ Yangilikni tahrirlash'
            : '➕ Yangi yangilik qo‘shish'}
        </h2>
        <input
          className="admin-input"
          type="text"
          placeholder="Yangilik sarlavhasi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="admin-textarea"
          placeholder="Yangilik matni"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          aria-label="Yangilik rasmi"
          onChange={(e) =>
            setImageFile(e.target.files?.[0] || null)
          }
        />
        <br />
        <br />
        <button type="button" className="admin-button" onClick={saveNews}>
          {editingId !== null
            ? '💾 O‘zgarishni saqlash'
            : '➕ Yangilikni saqlash'}
        </button>
        {editingId !== null && (
          <button type="button"
            className="admin-button cancel-button"
            onClick={() => {
              setEditingId(null)
              setTitle('')
              setContent('')
              setImageFile(null)
              setMessage('')
            }}
          >
            Bekor qilish
          </button>
        )}
        {message && (
          <div className="admin-message" role="status" aria-live="polite">
            {message}
          </div>
        )}
      </section>
      {/* NEWS LIST */}
      <section className="admin-card">
        <h2>📰 Barcha yangiliklar</h2>
        {news.length === 0 && (
          <p>Hozircha yangiliklar mavjud emas.</p>
        )}
        {news.map((item) => (
          <div className="news-item" key={item.id}>
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                decoding="async"
                width="800"
                height="500"
              />
            )}
            <h3>{item.title}</h3>
            <p>{item.content}</p>
            <div className="news-date">
              📅{' '}
              {new Date(item.created_at).toLocaleDateString(
                'uz-UZ'
              )}
            </div>
            <br />
            <button type="button"
              className="admin-button edit-button"
              onClick={() => editNews(item)}
            >
              ✏️ Tahrirlash
            </button>
            <button type="button"
              className="admin-button delete-button"
              onClick={() => deleteNews(item.id)}
            >
              🗑️ O‘chirish
            </button>
          </div>
        ))}
      </section>
{activeSection === "events" && (
  <section
    className="admin-card"
    id="events"
  >
    <h2>📅 Tadbirlar</h2>
    <p className="section-description">
      Maktab tadbirlarini qo‘shing, tahrirlang
      yoki o‘chiring.
    </p>
    <div className="adm-ach-form">
      <div>
        <label>Tadbir nomi</label>
        <input
          type="text"
          placeholder="Masalan: Fan olimpiadasi"
          value={eventTitle}
          onChange={(e) =>
            setEventTitle(e.target.value)
          }
        />
      </div>
      <div>
        <label>Sana</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) =>
            setEventDate(e.target.value)
          }
        />
      </div>
      <div>
        <label>Rasm</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setEventFile(
              e.target.files?.[0] || null
            )
          }
        />
      </div>
      <div className="adm-ach-full">
        <label>Tavsif</label>
        <textarea
          placeholder="Tadbir haqida maʼlumot..."
          value={eventDescription}
          onChange={(e) =>
            setEventDescription(e.target.value)
          }
        />
      </div>
      <div className="adm-ach-full">
        <button
          type="button"
          className="admin-button"
onClick={addEvent}
          disabled={eventLoading}
        >
          {eventLoading
            ? "⏳ Saqlanmoqda..."
            : "➕ Tadbir qo‘shish"}
        </button>
      </div>
    </div>

    {editingEvent && (
      <section className="event-edit-panel" aria-label="Tadbirni tahrirlash">
        <h3>✏️ Tadbirni tahrirlash</h3>
        <div className="adm-ach-form">
          <div>
            <label htmlFor="edit-event-title">Tadbir nomi</label>
            <input
              id="edit-event-title"
              type="text"
              value={editingEvent.title}
              onChange={(e) =>
                setEditingEvent((current) =>
                  current ? { ...current, title: e.target.value } : current
                )
              }
            />
          </div>

          <div>
            <label htmlFor="edit-event-date">Sana</label>
            <input
              id="edit-event-date"
              type="date"
              value={editingEvent.event_date || ""}
              onChange={(e) =>
                setEditingEvent((current) =>
                  current ? { ...current, event_date: e.target.value || null } : current
                )
              }
            />
          </div>

          <div>
            <label htmlFor="edit-event-image">Rasmni almashtirish (ixtiyoriy)</label>
            <input
              id="edit-event-image"
              type="file"
              accept="image/*"
              onChange={(e) => setEventEditFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="adm-ach-full">
            <label htmlFor="edit-event-description">Tavsif</label>
            <textarea
              id="edit-event-description"
              value={editingEvent.description || ""}
              onChange={(e) =>
                setEditingEvent((current) =>
                  current ? { ...current, description: e.target.value || null } : current
                )
              }
            />
          </div>

          <div className="adm-ach-full event-edit-actions">
            <button
              type="button"
              className="event-edit-save"
              onClick={saveEventEdit}
              disabled={eventLoading}
            >
              {eventLoading ? "⏳ Saqlanmoqda..." : "💾 O‘zgarishlarni saqlash"}
            </button>
            <button
              type="button"
              className="event-edit-cancel"
              onClick={cancelEventEdit}
              disabled={eventLoading}
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </section>
    )}
    {message && (
      <p className="admin-message" role="status" aria-live="polite">
        {message}
      </p>
    )}

    <div className="adm-ach-grid">
      {events.length === 0 ? (

        <div className="adm-ach-empty">
          <div className="adm-ach-empty-icon">
            📅
          </div>
          <h3>Hozircha tadbirlar yo‘q</h3>
          <p>
            Birinchi tadbirni yuqoridagi
            forma orqali qo‘shing.
          </p>
        </div>
      ) : (
        events.map((event) => (
          <article
            className="adm-ach-card"
            key={event.id}
          >
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="adm-ach-card-image"
                loading="lazy"
                decoding="async"
                width="800"
                height="500"
              />
            ) : (
              <div className="adm-ach-card-placeholder">
                📅
              </div>
            )}
            <div className="adm-ach-card-content">
              <h3 className="adm-ach-card-title">
                {event.title}
              </h3>
              {event.description && (
                <p className="adm-ach-card-description">
                  {event.description}
                </p>
              )}
              {event.event_date && (
                <div className="adm-ach-date">
                  📅 {event.event_date}
                </div>
              )}
              <div className="adm-ach-actions">
                <button
                  type="button"
                  className="adm-ach-edit"
                  onClick={() =>
                    editEvent(event)
                  }
                  disabled={eventLoading}
                >
                  ✏️ Tahrirlash
                </button>
                <button
                  type="button"
                  className="adm-ach-delete"
                  onClick={() =>
                    deleteEvent(event)
                  }
                  disabled={eventLoading}
                >
                  🗑️ O‘chirish
                </button>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  </section>
)}



{/* SCHOOL */}
{activeSection === 'school' && (
  <section className="admin-card" id="school">
    <div className="admin-section-header">
      <div>
        <span className="admin-section-kicker">MAKTAB</span>
        <h2>🏫 Maktab haqida</h2>
        <p className="section-description">
          Maktabning asosiy maʼlumotlarini shu yerdan boshqaring.
        </p>
      </div>
    </div>
    <div className="school-settings-form">
      <div className="school-form-group">
        <label className="admin-label">
          Maktab nomi
        </label>
        <input
          className="admin-input"
          type="text"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          placeholder="Masalan: 7-sonli umumiy o‘rta taʼlim maktabi"
        />
      </div>
      <div className="school-form-group">
        <label className="admin-label">
          Shior
        </label>
        <input
          className="admin-input"
          type="text"
          value={schoolSlogan}
          onChange={(e) => setSchoolSlogan(e.target.value)}
          placeholder="Maktab shiori"
        />
      </div>
      <div className="school-form-group school-form-full">
        <label className="admin-label">
          Maktab haqida
        </label>
        <textarea
          className="admin-textarea"
          value={schoolAbout}
          onChange={(e) => setSchoolAbout(e.target.value)}
          placeholder="Maktab haqida batafsil maʼlumot..."
          rows={6}
        />
      </div>
<div className="school-image-manager">
  {schoolSettings?.school_image_url && (
    <div className="current-school-image">
      <p className="admin-label">
        Hozirgi bosh sahifa rasmi
      </p>
      <img
        src={schoolSettings.school_image_url}
        alt="Maktabning hozirgi bosh sahifa rasmi"
        width="900"
        height="600"
        loading="lazy"
      />
    </div>
  )}
  <label className="admin-label">
    🖼️ Yangi bosh sahifa rasmi
  </label>
  <input
    className="admin-input"
    type="file"
    accept="image/*"
    disabled={schoolImageLoading}
    onChange={(e) => {
      const file = e.target.files?.[0]
      if (!file) {
        return
      }
      void uploadSchoolImage(file)
      // Bir xil faylni qayta tanlash imkonini beradi
      e.currentTarget.value = ""
    }}
  />
  <p className="section-description">
    Yangi rasm tanlang. U public saytning
    bosh sahifasidagi asosiy rasm sifatida
    ishlatiladi.
  </p>
  {schoolSettings?.school_image_url && (
    <button
      type="button"
      className="admin-button delete-button"
      disabled={schoolImageLoading}
      onClick={() => {
        void deleteSchoolImage()
      }}
    >
      {schoolImageLoading
        ? "⏳ Kuting..."
        : "🗑️ Bosh sahifa rasmini o‘chirish"}
    </button>
  )}
</div>
      <div className="school-settings-grid">
        <div>
          <label className="admin-label">
            O‘quvchilar soni
          </label>
          <input
            className="admin-input"
            type="number"
            min="0"
            value={studentsCount}
            onChange={(e) =>
              setStudentsCount(Number(e.target.value))
            }
          />
        </div>
        <div>
          <label className="admin-label">
            O‘qituvchilar soni
          </label>
          <input
            className="admin-input"
            type="number"
            min="0"
            value={teachersCount}
            onChange={(e) =>
              setTeachersCount(Number(e.target.value))
            }
          />
        </div>
        <div>
          <label className="admin-label">
            Sinflar soni
          </label>
          <input
            className="admin-input"
            type="number"
            min="0"
            value={classesCount}
            onChange={(e) =>
              setClassesCount(Number(e.target.value))
            }
          />
        </div>
        <div>
          <label className="admin-label">
            Tajriba yili
          </label>
          <input
            className="admin-input"
            type="number"
            min="0"
            value={experienceYears}
            onChange={(e) =>
              setExperienceYears(Number(e.target.value))
            }
          />
        </div>
      </div>
      <div className="school-profile-details">
        <h3>Maktab binosi va infratuzilmasi</h3>
        <p className="section-description">
          Yuridik manzil, bino holati, sig‘im va mavjud sharoitlarni kiriting.
        </p>
        <div className="school-settings-grid">
          <div>
            <label className="admin-label">Maktabning yuridik manzili</label>
            <input
              className="admin-input"
              type="text"
              value={schoolSettings?.legal_address ?? ''}
              onChange={(e) => updateSchoolProfile('legal_address', e.target.value || null)}
              placeholder="Tuman, MFY, ko‘cha va uy raqami"
            />
          </div>
          <div>
            <label className="admin-label">Maktab joylashgan hudud</label>
            <select
              className="admin-input"
              value={schoolSettings?.location_type ?? ''}
              onChange={(e) => updateSchoolProfile('location_type', e.target.value || null)}
            >
              <option value="">Tanlang</option>
              <option value="Shahar">Shahar</option>
              <option value="Tuman markazi">Tuman markazi</option>
              <option value="Qishloq">Qishloq</option>
              <option value="Olis hudud">Olis hudud</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Asosiy bino qurilgan yil</label>
            <input
              className="admin-input"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              value={schoolSettings?.building_year ?? ''}
              onChange={(e) => updateSchoolProfile('building_year', e.target.value === '' ? null : Number(e.target.value))}
            />
          </div>
          <div>
            <label className="admin-label">Bino holati</label>
            <select
              className="admin-input"
              value={schoolSettings?.building_condition ?? ''}
              onChange={(e) => updateSchoolProfile('building_condition', e.target.value || null)}
            >
              <option value="">Tanlang</option>
              <option value="Yaxshi">Yaxshi</option>
              <option value="Ta’mirtalab">Ta’mirtalab</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Ta’mirlangan yil</label>
            <input
              className="admin-input"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              value={schoolSettings?.renovation_year ?? ''}
              onChange={(e) => updateSchoolProfile('renovation_year', e.target.value === '' ? null : Number(e.target.value))}
            />
          </div>
          <div>
            <label className="admin-label">Ta’mir turi</label>
            <select
              className="admin-input"
              value={schoolSettings?.renovation_type ?? ''}
              onChange={(e) => updateSchoolProfile('renovation_type', e.target.value || null)}
            >
              <option value="">Tanlang</option>
              <option value="Yangi qurilgan">Yangi qurilgan</option>
              <option value="Rekonstruksiya">Rekonstruksiya</option>
              <option value="Kapital ta’mir">Kapital ta’mir</option>
              <option value="Joriy ta’mir">Joriy ta’mir</option>
            </select>
          </div>
          <div>
            <label className="admin-label">O‘quvchi o‘rni (sig‘imi)</label>
            <input
              className="admin-input"
              type="number"
              min="0"
              value={schoolSettings?.capacity ?? ''}
              onChange={(e) => updateSchoolProfile('capacity', e.target.value === '' ? null : Number(e.target.value))}
            />
            {schoolSettings?.capacity && schoolSettings.capacity > 0 ? (
              <small className="section-description">
                Sig‘imdan foydalanish: {((studentsCount / schoolSettings.capacity) * 100).toFixed(1)}%
              </small>
            ) : null}
          </div>
          <div>
            <label className="admin-label">Ta’lim tili</label>
            <input
              className="admin-input"
              type="text"
              value={schoolSettings?.education_language ?? ''}
              onChange={(e) => updateSchoolProfile('education_language', e.target.value || null)}
              placeholder="Masalan: O‘zbek"
            />
          </div>
          <div>
            <label className="admin-label">Smenalar soni</label>
            <input
              className="admin-input"
              type="number"
              min="1"
              value={schoolSettings?.shifts_count ?? ''}
              onChange={(e) => updateSchoolProfile('shifts_count', e.target.value === '' ? null : Number(e.target.value))}
            />
          </div>
          <div>
            <label className="admin-label">Oliy toifali pedagoglar soni</label>
            <input
              className="admin-input"
              type="number"
              min="0"
              max={teachersCount}
              value={schoolSettings?.teachers_highest_category_count ?? ''}
              onChange={(e) => updateSchoolProfile('teachers_highest_category_count', e.target.value === '' ? null : Number(e.target.value))}
              placeholder="Ma’lumot berilmagan"
            />
          </div>
          <div>
            <label className="admin-label">Maxsus fan xonalari</label>
            <input
              className="admin-input"
              type="text"
              value={schoolSettings?.special_classrooms ?? ''}
              onChange={(e) => updateSchoolProfile('special_classrooms', e.target.value || null)}
              placeholder="Masalan: Jihozlangan"
            />
          </div>
          <div>
            <label className="admin-label">Faollar zali / tadbirlar zali</label>
            <select
              className="admin-input"
              value={schoolSettings?.assembly_hall_condition ?? ''}
              onChange={(e) => updateSchoolProfile('assembly_hall_condition', e.target.value || null)}
            >
              <option value="">Tanlang</option>
              <option value="Mavjud, yaxshi">Mavjud, yaxshi</option>
              <option value="Mavjud, ta’mirtalab">Mavjud, ta’mirtalab</option>
              <option value="Mavjud emas">Mavjud emas</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Sport zali</label>
            <select
              className="admin-input"
              value={schoolSettings?.sports_hall_condition ?? ''}
              onChange={(e) => updateSchoolProfile('sports_hall_condition', e.target.value || null)}
            >
              <option value="">Tanlang</option>
              <option value="Mavjud, yaxshi">Mavjud, yaxshi</option>
              <option value="Mavjud, ta’mirtalab">Mavjud, ta’mirtalab</option>
              <option value="Mavjud emas">Mavjud emas</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Kutubxona</label>
            <select
              className="admin-input"
              value={schoolSettings?.library_condition ?? ''}
              onChange={(e) => updateSchoolProfile('library_condition', e.target.value || null)}
            >
              <option value="">Tanlang</option>
              <option value="Mavjud, yaxshi">Mavjud, yaxshi</option>
              <option value="Mavjud, ta’mirtalab">Mavjud, ta’mirtalab</option>
              <option value="Mavjud emas">Mavjud emas</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Oshxona</label>
            <select
              className="admin-input"
              value={schoolSettings?.cafeteria_condition ?? ''}
              onChange={(e) => updateSchoolProfile('cafeteria_condition', e.target.value || null)}
            >
              <option value="">Tanlang</option>
              <option value="Mavjud, yaxshi">Mavjud, yaxshi</option>
              <option value="Mavjud, ta’mirtalab">Mavjud, ta’mirtalab</option>
              <option value="Mavjud emas">Mavjud emas</option>
            </select>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="admin-button"
        onClick={saveSchoolSettings}
      >
        💾 Saqlash
      </button>
      {message ? (
        <p className="admin-message" role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </div>
    <div className="school-image-upload">
      <div className="school-image-upload-header">
        <div>
          <h3>🖼️ Maktab rasmi</h3>
          <p>
            Bosh sahifada ko‘rsatiladigan maktab rasmini boshqaring.
          </p>
        </div>
      </div>
      {/* Bu yerda sizdagi mavjud rasm yuklash kodi qoladi */}
    </div>
  </section>
)}
{activeSection === 'leadership' && (
  <section className="admin-card" id="leadership">
    <h2>👨‍💼 Rahbariyat</h2>
    <p className="section-description">
      Maktab rahbariyati maʼlumotlarini boshqaring.
    </p>
    <label className="admin-label">
      👤 F.I.Sh.
    </label>
    <input
      className="admin-input"
      type="text"
      value={leadershipName}
      onChange={(e) =>
        setLeadershipName(e.target.value)
      }
      placeholder="Masalan: Aliyev Anvar Anvarovich"
    />
    <label className="admin-label">
      💼 Lavozimi
    </label>
    <input
      className="admin-input"
      type="text"
      value={leadershipPosition}
      onChange={(e) =>
        setLeadershipPosition(e.target.value)
      }
      placeholder="Masalan: Maktab direktori"
    />
    <label className="admin-label">
      📞 Telefon
    </label>
    <input
      className="admin-input"
      type="text"
      value={leadershipPhone}
      onChange={(e) =>
        setLeadershipPhone(e.target.value)
      }
      placeholder="+998 XX XXX XX XX"
    />
    <label className="admin-label">
      📝 Maʼlumot
    </label>
    <textarea
      className="admin-textarea"
      value={leadershipDescription}
      onChange={(e) =>
        setLeadershipDescription(e.target.value)
      }
      placeholder="Rahbar haqida qisqacha maʼlumot"
    />
    <label className="admin-label">
      🖼️ Rahbar rasmi
    </label>
    <input
      className="admin-input"
      type="file"
      accept="image/*"
      aria-label="Rahbar rasmi"
      onChange={(e) =>
        setLeadershipFile(
          e.target.files?.[0] || null
        )
      }
    />
    <button type="button"
      className="admin-button"
      onClick={async () => {
        if (
          !leadershipName.trim() ||
          !leadershipPosition.trim()
        ) {
          setMessage(
            'F.I.Sh. va lavozimni kiriting!'
          )
          return
        }
        setLeadershipLoading(true)
        setMessage('')
        try {
          let imageUrl: string | null = null
          if (leadershipFile) {
            const fileExt =
              leadershipFile.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random()
              .toString(36)
              .substring(2)}.${fileExt}`
            const filePath =
              `leadership/${fileName}`
            const { error: uploadError } =
              await supabase.storage
                .from('news-images')
                .upload(
                  filePath,
                  leadershipFile
                )
            if (uploadError) {
              setMessage(
                'Rahbar rasmini yuklashda xato: ' +
                  uploadError.message
              )
              return
            }
            const { data: publicUrlData } =
              supabase.storage
                .from('news-images')
                .getPublicUrl(filePath)
            imageUrl =
              publicUrlData.publicUrl
          }
          const { error } = await supabase
            .from('school_leadership')
            .insert({
              full_name:
                leadershipName.trim(),
              position:
                leadershipPosition.trim(),
              phone:
                leadershipPhone.trim() || null,
              description:
                leadershipDescription.trim() ||
                null,
              image_url: imageUrl,
            })
          if (error) {
            setMessage(
              'Rahbarni saqlashda xato: ' +
                error.message
            )
            return
          }
          setLeadershipName('')
          setLeadershipPosition('')
          setLeadershipPhone('')
          setLeadershipDescription('')
          setLeadershipFile(null)
          await loadLeadership()
          setMessage(
            'Rahbar muvaffaqiyatli qo‘shildi! ✅'
          )
        } finally {
          setLeadershipLoading(false)
        }
      }}
      disabled={leadershipLoading}
    >
      {leadershipLoading
        ? '⏳ Saqlanmoqda...'
        : '➕ Rahbar qo‘shish'}
    </button>
    {message ? (
      <p className="admin-message" role="status" aria-live="polite">
        {message}
      </p>
    ) : null}
    <div className="admin-leadership-list">
      {leadership.map((person) => (
        <div
          className="admin-leadership-item"
          key={person.id}
        >
          {person.image_url && (
            <img
              src={person.image_url}
              alt={`${person.full_name} — ${person.position}`}
              loading="lazy"
              decoding="async"
              width="600"
              height="700"
            />
          )}
          <div style={{ flex: 1 }}>
            <strong>
              {person.full_name}
            </strong>
            <p>{person.position}</p>
            {person.phone && (
              <small>{person.phone}</small>
            )}
            {person.description && (
              <p>{person.description}</p>
            )}
            {editingLeadership?.id === person.id && (
              <div className="leadership-edit-panel">
                <h3>Rahbar maʼlumotlarini tahrirlash</h3>
                <label className="admin-label" htmlFor={`leadership-name-${person.id}`}>F.I.Sh.</label>
                <input
                  id={`leadership-name-${person.id}`}
                  className="admin-input"
                  value={editingLeadership.full_name}
                  onChange={(e) => setEditingLeadership((current) => current ? { ...current, full_name: e.target.value } : current)}
                  placeholder="F.I.Sh."
                />
                <label className="admin-label" htmlFor={`leadership-position-${person.id}`}>Lavozimi</label>
                <input
                  id={`leadership-position-${person.id}`}
                  className="admin-input"
                  value={editingLeadership.position}
                  onChange={(e) => setEditingLeadership((current) => current ? { ...current, position: e.target.value } : current)}
                  placeholder="Lavozimi"
                />
                <label className="admin-label" htmlFor={`leadership-phone-${person.id}`}>Telefon</label>
                <input
                  id={`leadership-phone-${person.id}`}
                  className="admin-input"
                  value={editingLeadership.phone || ''}
                  onChange={(e) => setEditingLeadership((current) => current ? { ...current, phone: e.target.value } : current)}
                  placeholder="+998 XX XXX XX XX"
                />
                <label className="admin-label" htmlFor={`leadership-description-${person.id}`}>Maʼlumot</label>
                <textarea
                  id={`leadership-description-${person.id}`}
                  className="admin-textarea"
                  value={editingLeadership.description || ''}
                  onChange={(e) => setEditingLeadership((current) => current ? { ...current, description: e.target.value } : current)}
                  placeholder="Rahbar haqida qisqacha maʼlumot"
                />
                <label className="admin-label" htmlFor={`leadership-image-${person.id}`}>Yangi rasm (ixtiyoriy)</label>
                <input
                  id={`leadership-image-${person.id}`}
                  className="admin-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLeadershipEditFile(e.target.files?.[0] || null)}
                />
                <div className="leadership-edit-actions">
                  <button type="button" className="leadership-edit-save" onClick={saveLeadershipEdit} disabled={leadershipLoading}>
                    {leadershipLoading ? '⏳ Saqlanmoqda...' : '💾 Saqlash'}
                  </button>
                  <button type="button" className="leadership-edit-cancel" onClick={cancelLeadershipEdit} disabled={leadershipLoading}>
                    Bekor qilish
                  </button>
                </div>
              </div>
            )}
<button type="button"
  className="admin-button"
  onClick={() =>
    editLeadership(person)
  }
  disabled={leadershipLoading}
  style={{
    background: '#2563eb',
    marginTop: '10px',
    marginRight: '8px',
  }}
>
  ✏️ Tahrirlash
</button>
            <button
              type="button"
              className="admin-button"
              onClick={() =>
                deleteLeadership(person)
              }
              disabled={leadershipLoading}
              style={{
                background: '#dc2626',
                marginTop: '10px',
              }}
            >
              🗑️ O‘chirish
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
)}
{activeSection === 'contact' && (
  <section className="admin-card" id="contact">
    <h2>📞 Aloqa</h2>
<p className="section-description">
  Maktabning aloqa maʼlumotlarini boshqaring.
  Bu maʼlumotlar public saytdagi Aloqa bo‘limida ko‘rinadi.
</p>
<label className="admin-label">
  📍 Manzil
</label>
<input
  className="admin-input"
  type="text"
  value={schoolSettings?.address || ''}
  onChange={(e) =>
    setSchoolSettings((prev) =>
      prev
        ? { ...prev, address: e.target.value }
        : prev
    )
  }
  placeholder="Maktab manzili"
/>
<label className="admin-label">
  📞 Telefon
</label>
<input
  className="admin-input"
  type="text"
  value={schoolSettings?.phone || ''}
  onChange={(e) =>
    setSchoolSettings((prev) =>
      prev
        ? { ...prev, phone: e.target.value }
        : prev
    )
  }
  placeholder="+998 XX XXX XX XX"
/>
<label className="admin-label">
  ✉️ Elektron pochta
</label>
<input
  className="admin-input"
  type="email"
  value={schoolSettings?.email || ''}
  onChange={(e) =>
    setSchoolSettings((prev) =>
      prev
        ? { ...prev, email: e.target.value }
        : prev
    )
  }
  placeholder="maktab@example.uz"
/>
<label className="admin-label">
  🕐 Ish vaqti
</label>
<input
  className="admin-input"
  type="text"
  value={schoolSettings?.working_hours || ''}
  onChange={(e) =>
    setSchoolSettings((prev) =>
      prev
        ? { ...prev, working_hours: e.target.value }
        : prev
    )
  }
  placeholder="Dushanba — Shanba"
/>
<button type="button"
  className="admin-button"
  onClick={async () => {
    if (!schoolSettings) {
      setMessage('Maktab maʼlumotlari topilmadi!')
      return
    }
    const { data, error } = await supabase
      .from('school_settings')
      .update({
        address: schoolSettings.address,
        phone: schoolSettings.phone,
        email: schoolSettings.email,
        working_hours: schoolSettings.working_hours,
        updated_at: new Date().toISOString(),
      })
      .eq('id', schoolSettings.id)
      .select()
      .single()
    if (error) {
      setMessage(
        'Aloqa maʼlumotlarini saqlashda xato: ' +
          error.message
      )
      return
    }
    setSchoolSettings(data)
    setMessage(
      'Aloqa maʼlumotlari muvaffaqiyatli saqlandi! ✅'
    )
  }}>
  💾 Saqlash
</button>
{message ? (
  <p className="admin-message" role="status" aria-live="polite">
    {message}
  </p>
) : null}
  </section>
)}
{activeSection === 'achievements' && (
  <section className="admin-card" id="achievements">
    <h2>🏆 Yutuqlar</h2>
    <p className="section-description">
      Maktabimizning olimpiada, sport, fan tanlovlari va boshqa yutuqlarini boshqaring.
    </p>
    <div className="adm-ach-form">
      <div>
        <label>Yutuq nomi</label>
        <input
          type="text"
          placeholder="Masalan: Viloyat olimpiadasida 1-o‘rin"
          value={achievementTitle}
          onChange={(e) => setAchievementTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Kategoriya</label>
        <input
          type="text"
          placeholder="Olimpiada / Sport / Fan / Tanlov"
          value={achievementCategory}
          onChange={(e) => setAchievementCategory(e.target.value)}
        />
      </div>
      <div>
        <label>Sana</label>
        <input
          type="date"
          value={achievementDate}
          onChange={(e) => setAchievementDate(e.target.value)}
        />
      </div>
      <div>
        <label>Rasm</label>
        <input
          type="file"
          accept="image/*"
          aria-label="Yangilik rasmi"
          onChange={(e) => setAchievementFile(e.target.files?.[0] || null)}
        />
      </div>
      <div className="adm-ach-full">
        <label>Tavsif</label>
        <textarea
          placeholder="Yutuq haqida qisqacha maʼlumot..."
          value={achievementDescription}
          onChange={(e) => setAchievementDescription(e.target.value)}
        />
      </div>
      <div className="adm-ach-full">
        <button type="button" onClick={uploadAchievement} disabled={achievementLoading}>
          {achievementLoading ? '⏳ Saqlanmoqda...' : '🏆 Yutuqni qo‘shish'}
        </button>
      </div>
    </div>
    {editingAchievement && (
      <section className="adm-ach-edit-panel" aria-label="Yutuqni tahrirlash">
        <h3>✏️ Yutuqni tahrirlash</h3>
        <div className="adm-ach-form">
          <div>
            <label htmlFor="edit-achievement-title">Yutuq nomi</label>
            <input
              id="edit-achievement-title"
              type="text"
              value={editingAchievement.title}
              onChange={(e) =>
                setEditingAchievement((current) =>
                  current ? { ...current, title: e.target.value } : current
                )
              }
            />
          </div>
          <div>
            <label htmlFor="edit-achievement-category">Kategoriya</label>
            <input
              id="edit-achievement-category"
              type="text"
              value={editingAchievement.category || ''}
              onChange={(e) =>
                setEditingAchievement((current) =>
                  current ? { ...current, category: e.target.value || null } : current
                )
              }
            />
          </div>
          <div>
            <label htmlFor="edit-achievement-date">Sana</label>
            <input
              id="edit-achievement-date"
              type="date"
              value={editingAchievement.achievement_date || ''}
              onChange={(e) =>
                setEditingAchievement((current) =>
                  current ? { ...current, achievement_date: e.target.value || null } : current
                )
              }
            />
          </div>
          <div>
            <label htmlFor="edit-achievement-image">Rasmni almashtirish (ixtiyoriy)</label>
            <input
              id="edit-achievement-image"
              type="file"
              accept="image/*"
              onChange={(e) => setAchievementEditImage(e.target.files?.[0] || null)}
            />
          </div>
          <div className="adm-ach-full">
            <label htmlFor="edit-achievement-description">Tavsif</label>
            <textarea
              id="edit-achievement-description"
              value={editingAchievement.description || ''}
              onChange={(e) =>
                setEditingAchievement((current) =>
                  current ? { ...current, description: e.target.value || null } : current
                )
              }
            />
          </div>
          <div className="adm-ach-full adm-ach-edit-actions">
            <button
              type="button"
              className="adm-ach-save"
              onClick={saveAchievementEdit}
              disabled={achievementEditLoading}
            >
              {achievementEditLoading ? '⏳ Saqlanmoqda...' : '💾 O‘zgarishlarni saqlash'}
            </button>
            <button
              type="button"
              className="adm-ach-cancel"
              onClick={cancelAchievementEdit}
              disabled={achievementEditLoading}
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </section>
    )}
    {message && (
      <p className="admin-message" role="status" aria-live="polite">
        {message}
      </p>
    )}

    <div className="adm-ach-grid">
      {achievements.length === 0 ? (
        <div className="adm-ach-empty">
          <div className="adm-ach-empty-icon">🏆</div>
          <h3>Hozircha yutuqlar yo‘q</h3>
          <p>Birinchi yutuqni yuqoridagi forma orqali qo‘shing.</p>
        </div>
      ) : (
        achievements.map((achievement) => (
          <article className="adm-ach-card" key={achievement.id}>
            {achievement.image_url ? (
              <img
                src={achievement.image_url}
                alt={`${achievement.title} — maktab yutug‘i`}
                className="adm-ach-card-image"
                loading="lazy"
                decoding="async"
                width="800"
                height="500"
              />
            ) : (
              <div className="adm-ach-card-placeholder">🏆</div>
            )}
            <div className="adm-ach-card-content">
              {achievement.category && (
                <span className="adm-ach-category">{achievement.category}</span>
              )}
              <h3 className="adm-ach-card-title">{achievement.title}</h3>
              {achievement.description && (
                <p className="adm-ach-card-description">{achievement.description}</p>
              )}
              {achievement.achievement_date && (
                <div className="adm-ach-date">📅 {achievement.achievement_date}</div>
              )}
              <div className="adm-ach-actions">
                <button
                  type="button"
                  className="adm-ach-edit"
                  onClick={() => editAchievement(achievement)}
                >
                  ✏️ Tahrirlash
                </button>
                <button
                  type="button"
                  className="adm-ach-delete"
                  onClick={() => deleteAchievement(achievement)}
                >
                  🗑️ O‘chirish
                </button>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  </section>
)}
      {/* IMAGES */}
{activeSection === 'images' && (
  <section className="admin-card" id="images">
    <h2>🖼️ Rasmlar</h2>
    <p className="section-description">
      Maktab rasmlarini shu yerdan yuklang va boshqaring.
    </p>
    <div className="gallery-upload-form">
      <label className="admin-label">
        📷 Rasm tanlang
      </label>
      <input
        className="admin-input"
        type="file"
        accept="image/*"
        onChange={(e) =>
          setGalleryFile(
            e.target.files?.[0] || null
          )
        }
      />
      <label className="admin-label">
        📝 Rasm nomi
      </label>
      <input
        className="admin-input"
        type="text"
        value={galleryTitle}
        onChange={(e) =>
          setGalleryTitle(e.target.value)
        }
        placeholder="Masalan: Maktab binosi"
      />
      <label className="admin-label">
        📄 Izoh
      </label>
      <textarea
        className="admin-textarea"
        value={galleryDescription}
        onChange={(e) =>
          setGalleryDescription(e.target.value)
        }
        placeholder="Rasm haqida qisqacha maʼlumot"
      />
      <button
        type="button"
        className="admin-button"
        onClick={uploadGalleryImage}
        disabled={galleryLoading}
      >
        {galleryLoading
          ? '⏳ Yuklanmoqda...'
          : '📤 Rasm yuklash'}
      </button>
    </div>
    {message ? (
      <p className="admin-message" role="status" aria-live="polite">
        {message}
      </p>
    ) : null}
    <div className="admin-gallery-grid">
      {galleryImages.map((image) => (
        <div
          className="admin-gallery-item"
          key={image.id}
        >
          <img
            src={image.image_url}
            alt={image.title || 'Maktab rasmi'}
            loading="lazy"
            decoding="async"
            width="800"
            height="600"
          />
          {editingGalleryId === image.id ? (
            <div className="admin-gallery-edit-form">
              <label className="admin-label" htmlFor={`gallery-file-${image.id}`}>
                Rasmni almashtirish (ixtiyoriy)
              </label>
              <input
                id={`gallery-file-${image.id}`}
                className="admin-input"
                type="file"
                accept="image/*"
                onChange={(e) => setEditingGalleryFile(e.target.files?.[0] || null)}
              />
              <label className="admin-label" htmlFor={`gallery-title-${image.id}`}>
                Rasm nomi
              </label>
              <input
                id={`gallery-title-${image.id}`}
                className="admin-input"
                type="text"
                value={editingGalleryTitle}
                onChange={(e) => setEditingGalleryTitle(e.target.value)}
              />
              <label className="admin-label" htmlFor={`gallery-description-${image.id}`}>
                Izoh
              </label>
              <textarea
                id={`gallery-description-${image.id}`}
                className="admin-textarea"
                value={editingGalleryDescription}
                onChange={(e) => setEditingGalleryDescription(e.target.value)}
                rows={3}
              />

              <div className="admin-gallery-edit-actions">
                <button
                  type="button"
                  className="admin-button gallery-edit-save"
                  onClick={saveGalleryImageEdit}
                  disabled={galleryLoading}
                >
                  {galleryLoading ? '⏳ Saqlanmoqda...' : '💾 Saqlash'}
                </button>
                <button
                  type="button"
                  className="admin-button gallery-edit-cancel"
                  onClick={cancelGalleryEdit}
                  disabled={galleryLoading}
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="admin-gallery-info">
                <strong>
                  {image.title || '7-Maktab'}
                </strong>
                {image.description && (
                  <p>{image.description}</p>
                )}
              </div>
              <button
                type="button"
                className="admin-button"
                onClick={() => editGalleryImage(image)}
                disabled={galleryLoading}
                aria-label={`${image.title || 'Maktab rasmi'} rasmini tahrirlash`}
                style={{ background: '#2563eb', marginTop: '10px', marginRight: '8px' }}
              >
                ✏️ Tahrirlash
              </button>
            </>
          )}
          <button
            type="button"
            className="admin-delete-button"
            onClick={() => deleteGalleryImage(image)}
            disabled={galleryLoading}
          >
            🗑️ O‘chirish
          </button>
        </div>
      ))}
    </div>
  </section>
)}
{activeSection === 'settings' && (
  <section
    className="admin-card account-settings"
    id="settings"
  >
    <div className="account-settings-header">
      <div className="account-settings-icon">
        ⚙️
      </div>
      <div>
        <span>ACCOUNT SETTINGS</span>
        <h2>Admin sozlamalari</h2>
        <p>
          Admin emaili va parolini xavfsiz
          tarzda boshqaring.
        </p>
      </div>
    </div>
    <div className="account-settings-form">
      <div className="settings-field">
        <label>📧 Admin Email</label>
        <input
          type="email"
          value={settingsEmail}
          onChange={(e) =>
            setSettingsEmail(e.target.value)
          }
          placeholder="admin@example.com"
        />
      </div>
      <div className="settings-divider">
        <span>🔐 PAROLNI O‘ZGARTIRISH</span>
      </div>
      <div className="settings-field">
        <label>🔑 Eski parol</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(e.target.value)
          }
          placeholder="Hozirgi parolingiz"
        />
      </div>
      <div className="settings-field">
        <label>🔐 Yangi parol</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
          placeholder="Kamida 6 ta belgi"
        />
      </div>
      <div className="settings-field">
        <label>🔐 Yangi parolni tasdiqlang</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          placeholder="Yangi parolni qayta kiriting"
        />
      </div>
      <div className="settings-security-info">
        <strong>🛡️ Xavfsizlik</strong>
        <p>
          Parolingiz Supabase Auth orqali
          xavfsiz saqlanadi. Parol oddiy matn
          ko‘rinishida bazaga yozilmaydi.
        </p>
      </div>
      <button
        type="button"
        className="settings-save-button"
        onClick={updateAdminAccount}
        disabled={settingsLoading}
      >
        {settingsLoading
          ? '⏳ Saqlanmoqda...'
          : '💾 O‘zgarishlarni saqlash'}
      </button>
    </div>
  </section>
)}
    </main>
  </div>
)
}
export default Admin