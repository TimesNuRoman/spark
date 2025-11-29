# 🔍 Экран Поиска (Search Screen)

## 📋 Описание
Функционал открытия контента и пользователей Spark с продвинутыми фильтрами и рекомендациями.

## 🎨 Дизайн экрана

```
╭───────────────────────────────────╮
│  ← Search                        │ ← Header с навигацией
├───────────────────────────────────┤
│  🔍 Search users, posts & tags... │ ← Search input
├───────────────────────────────────┤
│  🔥 Trending: #spark #motivation  │ ← Trending hashtags
│  🕕 Recent searches               │ ← Recent searches
├───────────────────────────────────┤
│  [ All ] [ Users ] [ Posts ] [ Tags] │ ← Filter tabs
├───────────────────────────────────┤
│  👤 Search Results               │
│                                   │ ← Empty state
│  No results found                 │
│  Try adjusting your search        │
│                                   │
│  👤 Alice Johnson                 │
│    12.3K followers • Developer    │ ← User result
│    Follow                         │
│                                   │
│  📝 "How to build great apps"     │
│    by Bob Smith • 2.1K likes      │ ← Post result
│    Amazing tutorial on UI/UX      │
│                                   │
│  ╭────────────────────────────────╮ │
│  │ 💡 Suggested for you          │ │ ← Recommendations
│  │ Users you might like          │ │
│  ╰────────────────────────────────╯ │
├───────────────────────────────────┤
│  🏠 🔍 ➕ 💬 👤    ⚫             │ ← Bottom navigation
╰───────────────────────────────────╯
```

## 🔧 Ключевые элементы

### 🔍 Главное поле поиска (Search Input)
- **Позиция**: Под header, ширина full-width - 16px
- **Стандартный стиль**: Минималистичный, no borders в обычном состоянии
- **Фокус стиль**: Синяя рамка (#2196F3), placeholder скрывается
- **Иконка**: Magnifying glass слева (20px)
- **Очистка**: "X" кнопка справа при текст ввода
- **Placeholder**: "Search users, posts & tags..."
- **Autocomplete**: Выпадающий список с recent + suggestions

### 🔥 Тренды и история (Trending & Recent)
- **Позиция**: Под search input, horizontal scrollable
- **Trending hashtags**: Pills с #icon, popular first
- **Recent searches**: Small pills, удаляемы click на 'x'
- **Background**: Легкий серый (#F8F8F8) для differentiate

### 📑 Табы фильтров (Filter Tabs)
- **Позиция**: Main content area
- **Tabs**: [ All ] [ Users ] [ Posts ] [ Tags ]
- **Активный**: Black background, white text
- **Неактивный**: Gray text, transparent background
- **Scrollable**: Если tabs не помещаются
- **Count badges**: Optional numbers like [Users (42)]

### 🔍 Результаты поиска (Search Results)

#### 👤 Пользователи (Users)
- **Формат**: Карточка поста, но compact
- **Элементы**:
  - **Avatar**: 60x60px левая сторона
  - **Name**: Bold, 18px верх
  - **Username**: @handle, gray ниж
  - **Bio**: Truncated to 1 line, 14px
  - **Stats**: "12.3K followers" right side
  - **Button**: "Follow/Unfollow" зеленый/gray
- **Сортировка**: Relevance + followers count

#### 📝 Посты (Posts)
- **Формат**: Compact post preview
- **Элементы**:
  - **Author**: Avatar + имя левая сторона
  - **Content**: Text preview (200 chars) + media thumbnail
  - **Timestamp**: "2 hours ago"
  - **Metrics**: "1.2K likes • 89 comments"
  - **Tags**: Highlighted hashtags
- **Preview images**: 120px height, click to expand

#### 🏷️ Хэштеги (Tags)
- **Формат**: List with counts
- **Элементы**:
  - **Tag name**: #spark - bold, blue text
  - **Count**: "152K posts" gray right
  - **Trending indicator**: 🔥 иконка если热门
- **Сортировка**: By popularity, then alphabetical

### 💡 Рекомендации (Suggestions)
- **Позиция**: Bottom area, collapsible section
- **Trigger**: Показываются когда нет результатов или empty search
- **Types**:
  - Users you might know
  - Popular posts in your area
  - Trending hashtags
  - Suggested searches

## 📱 Поведение и взаимодействия

### ⌨️ Поисковый ввод
- **Realtime suggestions**: Dropdown появляется после 3+ symbols
- **Enter press**: Execute search на current tab
- **Debounced**: 300ms delay между API calls
- **Voice search**: Microphone иконка в search field

### 🔄 Pull-to-refresh
- **Действие**: Refresh suggestions и trends
- **Индикатор**: Native platform style
- **Background**: Professional gray

### 📱 Touch interactions
- **Result tap**: Navigate to profile/post/thread
- **Long press**: Quick actions (Follow/Unfollow, Save, Share)
- **Swipe gestures**: Bookmark favorite searches
- **Double tap**: Follow user directly

### 📊 Infinite scroll
- **Trigger**: Auto-load when 80% down page
- **Loading**: Native skeleton screens
- **End state**: "No more results" message

## 🎨 Цветовая схема

### Светлая тема
- **Background**: #FFFFFF (Pure white)
- **Search input**: Transparent background, gray border on focus
- **Trending pills**: Light blue (#E3F2FD) with dark blue text
- **Recent pills**: Light gray (#F5F5F5) with black text
- **Active tab**: #1976D2 blue background, white text
- **Inactive tabs**: #666666 gray text
- **Result separators**: #F0F0F0 very light gray

### Темная тема
- **Background**: #121212 (Near black)
- **Search input**: #2A2A2A background, cyan border on focus
- **Trending pills**: Dark blue (#1E3A5F) with light blue text
- **Recent pills**: #333333 with #CCCCCC text
- **Active tab**: #2196F3 bright blue, black text
- **Inactive tabs**: #AAAAAA light gray
- **Result separators**: #333333 medium gray

## 📏 Адаптивность

### Мобильные (< 768px)
- **Search input**: Full width minus margins
- **_tabs**: Wrap to multiple rows или horizontal scroll
- **Results**: Single column, compact layout
- **Touch targets**: Min 44px height

### Планшеты (768px - 1024px)
- **Results**: Two-column grid для users/posts
- **Sidebar**: Optional filters panel слева
- **Search**: Larger input с voice search prominently

### Десктоп (> 1024px)
- **Search input**: Centered, width 600px max
- **Results**: Multi-column layout (3+ columns)
- **Sidebar**: Persistent filters + recommendations
- **Keyboard shortcuts**: Enter to search, arrows to navigate

## ⚡ Продвинутые возможности

### 🔮 AI-powered search
- **Smart autocomplete**: Context-aware suggestions
- **Semantic search**: Понимает intent даже с опечатками
- **Related results**: "People also searched for..."
- **Visual search**: Поиск по image content (future)

### 📊 Analytics tracking
- **Search funnel**: От input до action tracking
- **Click-through rates**: Какие результаты кликают
- **Conversion tracking**: Из search в follows/likes
- **A/B testing**: Different layouts and algorithms

### 🌐 Многоязычность
- **RTL Support**: Полная support для Arabic/Hebrew
- **Local results**: Regional content prioritization
- **Translation**: Automatic preview translation hints
- **Keyboard locales**: Smart keyboard switching

## 🔒 Приватность и безопасность
- **No tracking**: Server logs minimal, no third-party trackers
- **Encrypted queries**: Search terms hashed/encrypted
- **Safe content**: Toxic content filtered out
- **Abuse prevention**: Rate limiting per user/session

## ♿ Доступность
- **Screen readers**: "Результат поиска: пользователь [имя], [число подписчиков]"
- **Keyboard navigation**: Tab through results, Enter to select
- **High contrast**: Enhanced borders and text contrast
- **Voice commands**: Speak to search hands-free

## ⚡ Производительность
- **Local caching**: Recent searches cached offline
- **Image lazy-load**: Scroll-triggered loading
- **Memory management**: Result limitation (max 100 shown)
- **Background prefetch**: Anticipatory loading of popular content

## 🔀 Связанные экраны
- **User profile** от user result taps
- **Post detail** от post result taps
- **Hashtag feed** от tag result taps
- **Advanced search** через button в header
