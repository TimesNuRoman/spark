# 🔔 Экран Уведомлений (Notifications Screen)

## 📋 Описание
Лента активности и системных уведомлений пользователей Spark с категоризацией и управлением уведомлениями.

## 🎨 Дизайн экрана

```
╭───────────────────────────────────╮
│  ← Notifications                 │ ← Header с навигацией
├───────────────────────────────────┤
│  [ All ] [ Likes ] [ Comm ] [ Sys ]│ ← Filter tabs
├───────────────────────────────────┤
│  👤 Alice like your post          │
│     "Great post about technology" │ ← Notification item
│     5 min ago • Mark as read      │
│                                   │
│  💬 New comment on your photo     │
│     Bob: "Amazing shot!"          │
│     1 hour ago • Reply            │
│                                   │
│  👥 John started following you     │
│     You now have 342 followers    │
│     2 hours ago • Follow back      │
│                                   │
│  🔔 System: Welcome to Spark!      │
│     Complete your profile for...   │
│     1 day ago • Dismiss           │
├───────────────────────────────────┤
│  🏠 🔍 ➕ 💬 👤    ⚫             │ ← Bottom navigation
╰───────────────────────────────────╯
```

## 🔧 Ключевые элементы

### 📑 Табы фильтров (Filter Tabs)
- **Позиция**: Под header, ширина full-width
- **Tabs**: [ All ] [ Likes ] [ Comments ] [ System ]
- **Активный стиль**: Белый на черном фоне
- **Неактивный стиль**: Черный текст на сером фоне
- **Высота**: 48px

### 📋 Список уведомлений (Notifications List)
- **Сортировка**: По убыванию времени (свежие сверху)
- **Формат**: Timeline с разделителями по дням
- **Каждый элемент**:
  - **Иконка**: Avatar/иконка типа действия слева (40px)
  - **Content**:
    - **Main text**: Краткое описание действия, жирный
    - **Subtext**: Дополнительная информация (ссылка на пост и т.д.)
    - **Timestamp**: Правый верхний угол, серый текст
    - **Actions**: Кнопки действий правый нижний угол
  - **Unread indicator**: Синяя полоска слева для непрочитанных
  - **Высота**: Variable 80-100px + разделители

### 🎯 Типы уведомлений

#### ❤️ Likes
- **Иконка**: Красное сердечко
- **Текст**: "{User} liked your {post/photo/video}"
- **Actions**: "View post", "Follow back"
- **Цвет**: Красный (#FF0000) для иконки

#### 💬 Comments
- **Иконка**: Синий пузырь речи
- **Текст**: "New comment on your {post/photo/video}"
- **Subtext**: "Bob: 'Amazing content!'"
- **Actions**: "Reply", "View thread"
- **Цвет**: Синий (#007AFF) для иконки

#### 👥 Followers
- **Иконка**: Зеленый плюс-человек
- **Текст**: "{User} started following you"
- **Subtext**: "You now have {count} followers"
- **Actions**: "Follow back", "View profile"
- **Цвет**: Зеленый (#00C853) для иконки

#### 🔔 System notifications
- **Иконка**: Синий колокол уведомления
- **Текст**: "Welcome to Spark!" / "Update available"
- **Actions**: "Dismiss", "Learn more"
- **Цвет**: Синий (#1976D2) для иконки

## 📱 Поведение и взаимодействия

### 👆 Нажатия
- **Notification tap**: Переход к связанному контенту (пост, профиль)
- **Avatar tap**: Переход в профиль пользователя
- **Action buttons**: "Reply", "View", "Follow back" - соответственные действия
- **Dismiss tap**: Удаление уведомления с анимацией
- **Bulk actions**: Лонгпресс для множественного выбора

### 🔄 Pull-to-refresh
- **Действие**: Загрузить новые уведомления
- **Индикатор**: Native pull spinner
- **Background**: Professional gray/blue

### 📊 Bulk operations
- **Select mode**: Checkbox слева от каждого item
- **Group actions**: Mark all read, Delete selected
- **Exit**: Tap "Cancel" или свайп вниз

## 🎨 Цветовая схема

### Светлая тема
- **Background**: #FFFFFF (Pure White)
- **Tab active**: Black text on #F0F0F0 background
- **Tab inactive**: Gray text (#666666) on white
- **Separator lines**: #F0F0F0 (Very light gray)
- **Unread indicator**: Blue stripe (#2196F3) left side
- **Like notifications**: Red avatar background (#FFEBEE)
- **Comment notifications**: Blue avatar background (#E3F2FD)
- **Follow notifications**: Green avatar background (#E8F5E8)
- **System notifications**: Gray avatar background (#F5F5F5)

### Темная тема
- **Background**: #121212 (Dark)
- **Tab active**: White text on #333333 background
- **Tab inactive**: Gray text (#AAAAAA) on #1E1E1E
- **Separator lines**: #333333 (Medium dark)
- **Unread indicator**: Cyan stripe (#00BCD4)
- **Like notifications**: Dark red (#1A0000) background
- **Comment notifications**: Dark blue (#00001A) background
- **Follow notifications**: Dark green (#001A00) background
- **System notifications**: Medium gray (#2A2A2A) background

## 📏 Адаптивность

### Мобильные устройства (< 768px)
- **Avatar size**: 40px (circular)
- **Text sizes**: Mobile standard (14px main, 12px sub)
- **Touch targets**: Min 44px height
- **Tabs**: Scrollable if needed

### Планшеты (768px - 1024px)
- **Avatar size**: 50px
- **Text sizes**: 16px/14px
- **Two-column**: Portrait grid layout
- **Sidebar**: Left panel for filters

### Десктоп (> 1024px)
- **Avatar size**: 60px
- **Text sizes**: Desktop sizes (18px/16px)
- **Three-column**: Main content + filters sidebar
- **Hover states**: Button highlighting

## 🌐 Многоязычность
- **RTL Support**: Зеркалирование для Arabic/Hebrew
- **Переводы**: "Mark as read", "Reply", action labels
- **Time formats**: "5 min ago", "1 hour ago", "Yesterday"
- **Pluralization**: Proper forms for follower counts

## ⚡ Производительность
- **Pagination**: Загрузка по 50 уведомлений
- **Virtual scrolling**: Для длинных списков (1000+ items)
- **Image optimization**: Автор avatars - WebP/AVIF с fallback
- **Caching**: MIME types cached locally для быстрых загрузок

## 🔄 Особенности синхронизации
- **Real-time push**: New notifications appear instantly
- **Background sync**: While app closed - показывать при открытии
- **Conflict resolution**: Server-side notification deduplication
- **Delivery guarantees**: At-least-once delivery through persistent queues

## ⚙️ Настройки уведомлений
- **Per-type controls**: Toggle each notification type
- **Sound options**: Custom sounds per type
- **Do Not Disturb**: Time ranges для отключения
- **Email fallback**: When push fails

## ♿ Доступность
- **Screen reader**: "Уведомление от [пользователь] о [действие], [время]"
- **High contrast**: Увеличенная видимость unread indicators
- **Large text**: Масштабирование сохраняет readability
- **Keyboard navigation**: Tab through items and actions
