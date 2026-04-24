# AI Services

src/
│
├── app/ # app-level setup
│ ├── App.tsx
│ ├── main.tsx
│ ├── Layout.tsx
│
├── features/ # 🔥 MAIN ARCHITECTURE
│
│ ├── auth/
│ │ ├── pages/
│ │ │ ├── Login.tsx
│ │ │ ├── Register.tsx
│ │ │ ├── ForgotPassword.tsx
│ │
│ │ ├── components/
│ │ │ ├── AuthCard.tsx
│ │
│ │ ├── services/
│ │ │ ├── authService.ts
│
│ ├── todo/
│ │ ├── pages/
│ │ │ ├── TodoPage.tsx
│ │
│ │ ├── components/
│ │ │ ├── TodoInput.tsx
│ │ │ ├── TodoItem.tsx
│ │
│ │ ├── hooks/
│ │ │ ├── useTodo.ts
│
│ ├── game/ # 🔥 YOUR TIC TAC TOE FEATURE
│ │ ├── pages/
│ │ │ ├── GamePage.tsx
│ │
│ │ ├── components/
│ │ │ ├── Board.tsx
│ │ │ ├── Square.tsx
│ │ │ ├── Stats.tsx
│ │ │ ├── Controls.tsx
│ │ │ ├── Status.tsx
│ │
│ │ ├── hooks/
│ │ │ ├── useGame.ts
│ │
│ │ ├── utils/
│ │ │ ├── ai.ts
│ │ │ ├── minimax.ts
│
│ ├── analytics/
│ │ ├── components/
│ │ │ ├── AnalyticsPolarChart.tsx
│
│
├── shared/ # reusable global components
│ ├── components/
│ │ ├── CustomButton.tsx
│ │ ├── CustomTextField.tsx
│ │ ├── CustomBox.tsx
│ │ ├── PageTitle.tsx
│
│ ├── layout/
│ │ ├── Header.tsx
│ │ ├── Sidebar.tsx
│
│
├── services/ # global APIs (optional)
│ ├── api.ts
│
