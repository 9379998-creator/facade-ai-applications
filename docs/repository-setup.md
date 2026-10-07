# Настройка репозитория GitHub (Repository Setup & Protection)

## 1. Базовые параметры репозитория
- **Репозиторий**: `9379998-creator/facade-ai-applications`
- **Видимость**: `PUBLIC`
- **Основная ветка**: `main`
- **Рабочая ветка первичной настройки**: `chore/bootstrap-project`
- **Wiki**: Отключена (`hasWikiEnabled: false`)
- **Issues**: Включены
- **Projects**: Включены

## 2. Статус функций безопасности (Бесплатные возможности GitHub)
- **Secret Scanning**: `ENABLED`
- **Push Protection**: `ENABLED`
- **Dependabot Alerts**: `ENABLED`
- **Automated Security Fixes**: `ENABLED`
- **Private Vulnerability Reporting**: `REQUIRES MANUAL ACTION` (включается владельцем в настройках `Settings -> Code security and analysis -> Private vulnerability reporting` при необходимости).

## 3. Настройка защиты ветки main (Branch Protection / Ruleset)
Для обеспечения целостности истории ветка `main` требует защиты. Поскольку настройки прав и тарифных планов репозитория могут накладывать ограничения на автоматическое создание rulesets через GitHub CLI без прав администратора организации, владельцу рекомендуется выполнить следующие шаги в интерфейсе GitHub:

### Ручные шаги настройки (Интерфейс GitHub):
1. Открыть `https://github.com/9379998-creator/facade-ai-applications/settings/branches`.
2. Нажать **Add branch ruleset** (или **Add branch protection rule**).
3. Указать имя правила: `protect-main`.
4. В поле целевой ветки выбрать: `Include default branch` (`main`).
5. Включить опции:
   - [x] **Restrict deletions** (запрет удаления ветки main).
   - [x] **Block force pushes** (запрет force push в ветку main).
   - [x] **Require a pull request before merging** (изменения только через PR).
   - [x] **Require status checks to pass before merging**:
     - Выбрать проверку: `validate` (workflow CI).
   - [x] **Require branches to be up to date before merging**.
   - [x] **Require conversation resolution before merging**.
6. Сохранить изменения.

**Статус настройки защиты ветки**: `OPEN` (требуется подтверждение/выполнение владельцем в интерфейсе GitHub).
