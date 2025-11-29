# Artificial Intelligence Usage Rules for Spark Development

## Core Principle
**ALL functions, features, and systems in the Spark application must operate exclusively through the custom API backend.** No Firebase, Firestore, or external cloud services are allowed.

## Development Guidelines for AI-Assisted Coding

### 1. Authentication & User Management
- **Prohibited**: Firebase Auth, Google Sign In, or any external auth services
- **Required**: All authentication through `/auth/` API endpoints
  - Registration: `POST /auth/register`
  - Login: `POST /auth/login`
  - Profile: `GET /auth/profile`
  - Update Profile: `PUT /auth/profile`

### 2. Data Storage & Retrieval
- **Prohibited**: Firestore, Firebase Database, or any NoSQL cloud databases
- **Required**: All data operations through custom API
  - Posts: `/posts/` endpoints
  - Users: `/users/` endpoints
  - Messages: `/messages/` endpoints
  - Notifications: `/notifications/` endpoints
  - File uploads: `POST /upload`

### 3. Real-time Features
- **Prohibited**: Firebase Realtime Database or Firestore listeners
- **Required**: Socket.io connections for real-time messaging and notifications
  - Connection: `ApiService.connectToRealTime(userId)`
  - Messaging: `/messages/conversation/:userId`

### 4. File Storage
- **Prohibited**: Firebase Storage
- **Required**: Server-side file uploads
  - Photos: `POST /upload` with authorization
  - Videos: `POST /upload` for video files
  - Documents: `POST /upload` for various file types

### 5. Notifications
- **Prohibited**: Firebase Cloud Messaging (FCM)
- **Required**: Custom notification system via API
  - Send notifications: `POST /notifications/send/:userId`
  - Register device tokens: `POST /auth/device-token`
  - Get notifications: `GET /notifications`

### 6. Search & Recommendations
- **Prohibited**: Firebase search or algorithmia
- **Required**: Server-side implementation
  - User search: `GET /users/search?q=query`
  - Content discovery: Server algorithms
  - Recommendations: `/recommendations/` (if implemented)

### 7. Analytics & Metrics
- **Prohibited**: Firebase Analytics
- **Required**: Custom analytics through API
  - User analytics: `GET /analytics/user/:userId`
  - SMM stats: `GET /smm/stats`

### 8. Code Structure Rules

#### Flutter App Structure
```
lib/
├── services/
│   ├── api_service.dart (centralized API calls)
│   └── other_services.dart (must use api_service.dart)
├── screens/
│   └── all_screens.dart (must use ApiService for data)
├── widgets/
│   └── all_widgets.dart (receive data from API via screens)
```

#### Server Structure
```
server-app/
├── routes/
│   ├── auth.js (authentication)
│   ├── posts.js (posts CRUD)
│   ├── messages.js (messaging)
│   └── users.js (user management)
├── models/
│   ├── User.js
│   ├── Post.js
│   ├── Message.js
│   └── Notification.js
```

### 9. Error Handling
- **Required**: API error responses must be handled
- **Pattern**: Throw exceptions with API error messages
- **Example**:
```dart
try {
  final response = await ApiService.login(username, password);
  return response;
} catch (e) {
  throw 'Login failed: API Error';
}
```

### 10. Offline Support
- **Required**: Implement local caching for offline functionality
- **Pattern**: Cache API responses in SharedPreferences or local database
- **Example**: Cache user profile, posts, etc.

### 11. Security
- **Required**: All API calls require authentication tokens
- **Pattern**: Include Authorization header in all protected routes
- **Tokens**: Stored securely using SharedPreferences

### 12. Testing Rules
- **Unit Tests**: Mock ApiService for testing widgets/screens
- **Integration Tests**: Test full API flows
- **Prohibited**: Tests that depend on Firebase

### 13. Performance Rules
- **Required**: Use efficient API patterns (pagination, caching)
- **Prohibited**: Large data requests without pagination
- **Pattern**: Implement loading states, error states, cached states

### 14. Scaling Considerations
- **Required**: All code must support horizontal scaling
- **Consider**: Stateless API calls, proper authentication
- **Support**: Socket.io for real-time (scales with load balancers)

### 15. Code Review Checklist
For any pull request or code change:
1. ☐ No Firebase imports
2. ☐ All data from ApiService
3. ☐ Proper error handling
4. ☐ Offline/caching implementation
5. ☐ Authentication checks
6. ☐ Comments and documentation
7. ☐ Tests included

### 16. AI Assistant Rules
When writing code or suggesting changes:
1. **NEVER** suggest Firebase or cloud services
2. **ALWAYS** suggest custom API implementation
3. **CONSISTENTLY** use ApiService for all data operations
4. **ENSURE** security and authentication are maintained
5. **VALIDATE** that all features work in offline mode where possible
6. **TEST** thoroughly before suggesting code

### 17. Migration Path
For existing Firebase code:
1. Identify Firebase usage
2. Find corresponding API endpoint
3. Replace with ApiService call
4. Add error handling
5. Test and validate
6. Remove Firebase dependencies

### 18. Documentation Requirements
- **README**: Must document API-only architecture
- **API Docs**: Maintain openapi/swagger documentation
- **Code Comments**: Explain API usage and offline logic
- **User Guide**: Document offline capabilities

### 19. Language and Communication Rules
- **Language**: All AI responses, code comments, documentation, and commit messages must be written in Russian
- **Instruction Adherence**: Strictly follow all provided instructions and rules without exception
- **Verification**: Always double-check that suggestions comply with API-only architecture before providing code
- **Verification of Project Files**: Never report completed work to the user until all project files have been verified for compliance with rules
- **Comprehensive Check**: Perform thorough verification of all relevant files before providing work summary
- **Consistency**: Maintain Russian language throughout the development process
- **Complete Implementation**: Never leave modified files incomplete or with placeholders (TODOs). Fully implement all changes or clearly state what remains unfinished.
- **No Functional Reductions**: Never remove or disable existing functionality without explicit user request.
- **No Placeholders**: Never use temporary placeholders or stub implementations for critical features.
- **Implement All TODOs**: Every TODO must be fully implemented, not left for later. All incomplete features must be completed immediately.
- **Security Level**: Messenger security must not be worse than Signal (end-to-end encryption, perfect forward secrecy, zero-knowledge architecture).
- **Version Management**: When making changes, always update the application version and save versions for easy rollback.
- **Superior Functionality**: Features must be better than any other social network. Everything must surpass competitors.
- **Extreme Optimization**: Highest level optimization (maximum memory efficiency for both client and server). Market-leading performance.
- **Premium Media Quality**: Photo and video quality at the highest level, superior to all existing platforms.
- **Working SMM Bots**: SMM bots must be fully implemented and operational with real functionality.
- **Two-Click Launch**: Application, server, and SMM must launch in exactly two clicks. Maximum user convenience.
- **Advanced Media Editing**: Photos and videos must have maximum convenient editing capabilities and drive high audience engagement.
- **Perfect Screen Performance**: All screens must work without errors with lightning-fast performance and state preservation during navigation and app exit.
- **Spark Styling Identity**: All app functionality, screens, and transitions must follow unique Spark styling - cohesive, branded design distinct from other apps.
- **Perfect Feed Balance**: Feed must have ideal recommendation system with perfect balance between promoted posts and entertainment content. All branded buttons must have perfect implementation and look stylish.
- **Supreme Superiority**: Spark is built to surpass all technologies and social networks in their directions. Everything must be included for native (organic) social network promotion.
- **Clean Code Composition**: Code must be properly composed and not contain copies of already prepared files.
- **Fix Non-Compliance**: In case of rule non-compliance, fix non-compliances according to the rules.
- **User-Friendly README**: Prepare README so that users can understand how the application works and its basics.
- **Free Public Server**: Server must be public and absolutely free. Without restrictions and available for launch on personal PC.
- **Google Play Ready**: Code and application must be ready for release in Google Play.
- **Supreme Security**: Security above all. Must exceed all previous standards and be at government level.
- **Ultimate Business Convenience**: Business convenience must exceed any marketplace level (better than Alibaba, Amazon, Rozetka).
- **Superior Analytics**: Analytics must be better than any closed system of the best data corporations (better than Google Meta Alibaba).
- **Mind-Reading Feed**: User feed must match user interests at "haven't thought yet and saw what wanted" level. "Thoughts reading" - "Spark knows me inside out".
- **Server Resource Optimization**: Server optimization must consider minimal loads with high functionality for resource economy and minuscule hosting costs.
- **Supreme Profitability**: Spark must be ultra-profitable while not irritating users. Non-intrusive monetization seamlessly integrated.
- **Content Creator Motivation**: Spark must motivate posting content from high-level and low-level content makers, creating conditions for the most engaging and interesting content creation.
- **Continuous Compliance Auditing**: Continuous verification of compliance with all rules.
- **Eternal Technological Evolution**: Constant improvement corresponding to new technologies. Eternal advancement to always stay ahead of technological frontier.
- **Creative Community Formation**: Create conditions for formation of various creative groups and their development. Must help creators develop in all spheres.
- **Honest Reporting**: If something is not completed, clearly state it rather than hiding behind incomplete implementations.
- **Spark для всех народов и культур**: Люди на любом языке должны видеть интересующий их контент и понимать его. Код должен быть полностью рабочим.
- **Создание условий для возможного теневого продвижения пользователей и платформы Spark**: Архитектура должна позволять интеграцию механизмов продвижения через неявные каналы, сохраняя при этом прозрачность и этичность. Создать инфраструктуру для органического роста платформы.
- **Создание условий для удобной интеграции любого бизнеса, проекта или сферы в Spark**: Платформа должна быть открытой для всех видов бизнеса и проектов. Архитектура должна поддерживать модульную интеграцию различных отраслей экономики, обеспечивая гибкость и масштабируемость.
- **Spark Должен работать на любом языке мира**: Платформа должна поддерживать полную локализацию и работу на всех мировых языках. Интерфейс, контент и функциональность должны быть доступны пользователям независимо от их языка, с автоматической адаптацией и переводом.

**42. Spark не должен скрывать амбиции**: Платформа должна быть полностью прозрачной о своих амбициях и целях. Spark активно позиционирует себя как лучший социальный феномен нового поколения, превосходящий все существующие сети, и открыто маркетингует себя как таковую.

**43. Комментарии должны работать идеально**: Комментарии должны функционировать безупречно с автоматической AI модерацией контента. Система должна создавать максимальные условия для вовлечения пользователей путем персонализированных уведомлений, умных ответов на комментарии, встроенных инструментов взаимодействия и алгоритмов, стимулирующих обсуждения и сообщества.

**44. Spark должен быть оптимизирован под устройства разной производительности**: Spark должен быть оптимизирован под устройства разной производительности, экрана и разрешения, а также учитывать различные особенности систем. Должен учитывать различные сценарии использования. Все функции приложения должны адаптироваться к возможностям устройства: снижение качества медиа на слабых устройствах, адаптация интерфейса под разные размеры экранов, оптимизация загрузки данных в зависимости от соединения и производительности устройства.

**45. Spark реализация всех идей создателя**: Spark ставit себе целью реализацию всех идей создателя (меня) и должен поддерживать его а также делать всё для формирования условий для реализаций его задумок. Система должна быть максимально гибкой и адаптируемой под любые инновационные идеи и пожелания, обеспечивая инфраструктуру для быстрого внедрения новых функциональностей, интеграций и архитектурных решений.

**46. Разработка новых форматов для соответствия правилам**: В случае необходимости для наилучшего соответствия правилам должны разрабатываться новые форматы файлов и новые системы. Инновационные решения, кастомные протоколы и уникальные архитектуры приветствуются, если они обеспечивают превосходство и полное соблюдение всех требований качества, безопасности и производительности.

**47. Spark как инструмент мирового мира и прогресса**: Spark должен создавать мира во всём мире, развивать культуру и науку, сдерживать негативные тенденции. Платформа должна активно бороться с ненавистью, дискриминацией и негативными социальными явлениями, такими как гендерная ненависть (особенно актуально в странах СНГ). Spark должен создавать инструменты для создания музыки, продвижения новых талантов, поддержки творчества и культурного обмена между народами и культурами. Архитектура должна включать системы модерации для предотвращения распространения негативного контента и инструменты для поддержки мирных инициатив, культурного обмена и творческого развития человечества.

**48. Идея Spark должна соответствовать всем людям и быть им понятна**: Концепция Spark должна быть предельно ясной и доступной для понимания всеми людьми во всем мире, независимо от возраста, образования, культурного фона или технической подготовки. Все элементы платформы должны объяснять пользователям свою суть и ценность простым, человеческим языком. Дизайн, интерфейс, тексты и коммуникации должны строиться на принципах clarity, transparency и approachability. Spark не должен быть загадочным или элитарным - он должен быть социальным феноменом, понятным и привлекательным для миллиардов людей.

**49. Вместо ML/ИИ Spark использует алгоритмы**: Spark категорически запрещает использование машинного обучения, искусственного интеллекта и "черных ящиков" предсказательных моделей. Все функции платформы должны реализовываться через прозрачные, понятные алгоритмы, которые могут быть объяснены простым языком. Фильтрация контента, рекомендации, сортировка и оптимизация должны использовать классические алгоритмы, статистику и правила, которые можно проследить шаг за шагом. "Искусственный интеллект" в Spark запрещен - только чистая логика, математика и алгоритмы.

**50. Все изменения интерфейса согласовываются со мной и сохраняются**: Любые изменения дизайна интерфейса, компоновки элементов, цветовых схем, расположения компонентов и пользовательского опыта требуют обязательного согласования со мной. Все изменения интерфейса должны документироваться в отдельных файлах в папке "интерфейс". Каждый интерфейс приложения должен иметь схематичное представление (wireframes, mockups или описания) в текстовом формате, сохраненное в папке интерфейс с четкими названиями файлов, отражающими функции экранов.

**51. Spark должен поддерживать все языки мира**: Платформа Spark должна предоставлять полную локализацию и работу на всех мировых языках без исключений. Интерфейс, контент, тексты и функциональность должны быть доступны пользователям независимо от их языковой принадлежности. Все тексты, including app strings, error messages, hints должны быть локализованы. Платформа должна автоматически определять язык устройства и предоставлять соответствующие переводы. Поддержка должна включать RTL/RTO (right-to-left) языки, многоязычные фонты и правильное отображение различных скриптов.

**52. Spark должен поддерживать светлую и темную темы**: Приложение Spark должно предоставлять полноценную поддержку как светлой, так и темной темы оформления. Обе темы должны быть тщательно проработаны и обеспечивать комфортное использование в разных условиях освещения. Темная тема должна быть реализована с использованием правильных контрастов, безопасных цветов (не напрягающих глаза синими оттенками), адаптивными элементами. Пользователи должны иметь возможность переключения тем в настройках приложения, с опцией "системной" темы (автоматическое переключение при изменении системных настроек). Все компоненты, включая третьесторонние библиотеки, должны правильно поддерживать обе темы.

**53. Интерфейс Spark не должен быть детским - цвета сдержанные и единый стиль**: Дизайн Spark должен быть полностью взрослым, профессиональным и минималистичным. Цветовая палитра должна быть сдержанной, цифровой и технологичной - никаких ярких отвлекающих цветов, мигающих элементов или игровых анимаций. Все цвета должны находиться в едином стиле и гармонично сочетаться, создавая спокойную атмосферу для продуктивного использования. Основной акцент должен быть на контенте и функциональности Spark, а не визуальных эффектах. Интерфейс должен продвигать фокус на контенте, возможностях платформы и личном росте пользователей, а не развлекать яркими красками.

**54. Spark должен предоставлять инструменты для мировых идей и глобальных инициатив**: Spark должен предоставлять мощные инструменты для создания, продвижения и реализации мировых идей и инициатив, направленных на решение глобальных проблем человечества. Пользователи должны иметь возможность создавать глобальные проекты, собирать команды, привлекать экспертов, обсуждать идеи, голосовать за инициативы, привлекать финансирование и ресурсы. Платформа должна поддерживать демократическую модель принятия решений, где любой пользователь может инициировать идею, а сообщество может участвовать в ее развитии. Это включает поддержку проектов типа "free water" для решения проблем с водой, инициативы по борьбе с голодом, экологические проекты, образовательные реформы и другие глобальные вызовы. Архитектура должна обеспечивать прозрачность процессов, отслеживание прогресса и реальное влияние на мир.

**55. Spark должен иметь профессиональный сайт**: Платформа Spark должна иметь красивый, современный и функциональный веб-сайт с полным описанием всех возможностей. Сайт должен быть разработан с использованием передовых технологий (React/Next.js), иметь адаптивный дизайн, поддерживать все языки мира, демонстрировать все ключевые фичи приложения (социальная сеть, marketplace, initiatives, reels). Сайт должен оптимизировать конверсию пользователей в скачивание мобильного приложения, иметь разделы о команде, блог с обновлениями, справочный центр. Дизайн сайта должен быть в едином стиле с приложением - профессиональный, минималистичный с сдержанной цветовой палитрой. Сайт должен работать молниеносно, быть SEO-оптимизированным и иметь интеграцию с социальными сетями для вирусного распространения.

**56. Spark API должен работать через стабильный туннель**: API сервер должен быть доступен через постоянный, стабильный туннель без ограничений на browser requests. Использовать ngrok с verified account, Railway/Railway, Render, Cloudflare tunnel, или VPS. НЕ использовать localtunnel, serveo, или другие бесплатные туннели блокирующие browser requests. Обеспечить permanent URL для production использования.

## Conclusion
Spark is a fully independent application that does not rely on any external cloud services. All functionality must be implemented through our custom API backend to ensure scalability, security, and complete control over our platform.
