export type Compliment = {
  id: string
  title: string
  priceRub: number
  weightG: number
  budgetFrom?: number
  budgetTo?: number
  imageUrl: string
  description?: string
}

export const mockCompliments: Compliment[] = [
  {
    id: '1',
    title: 'Стейк из говядины',
    priceRub: 1200,
    weightG: 250,
    budgetFrom: 2000,
    budgetTo: 3000,
    imageUrl: '/vite.svg',
    description: 'Ароматный стейк из мраморной говядины средней прожарки. Подаётся с овощами гриль и соусом на выбор.'
  },
  {
    id: '2',
    title: 'Паста карбонара',
    priceRub: 650,
    weightG: 300,
    budgetFrom: 1000,
    budgetTo: 2000,
    imageUrl: '/vite.svg',
    description: 'Классическая паста с беконом, яйцом и пармезаном. Готовится по традиционному итальянскому рецепту.'
  },
  {
    id: '3',
    title: 'Салат Цезарь',
    priceRub: 450,
    weightG: 200,
    budgetFrom: 1000,
    budgetTo: 2000,
    imageUrl: '/vite.svg',
    description: 'Свежий салат с курицей, сыром пармезан, сухариками и фирменным соусом.'
  },
  {
    id: '4',
    title: 'Лосось на гриле',
    priceRub: 980,
    weightG: 200,
    budgetFrom: 2000,
    budgetTo: 3000,
    imageUrl: '/vite.svg',
    description: 'Филе лосося, приготовленное на гриле. Подаётся с овощами и лимоном.'
  },
  {
    id: '5',
    title: 'Борщ украинский',
    priceRub: 380,
    weightG: 350,
    budgetFrom: 1000,
    budgetTo: 2000,
    imageUrl: '/vite.svg',
    description: 'Наваристый борщ с говядиной, сметаной и свежей зеленью. Традиционный рецепт.'
  },
  {
    id: '6',
    title: 'Ризотто с грибами',
    priceRub: 720,
    weightG: 280,
    budgetFrom: 2000,
    budgetTo: 3000,
    imageUrl: '/vite.svg',
    description: 'Кремовое ризотто с белыми грибами и пармезаном. Готовится на бульоне.'
  },
  {
    id: '7',
    title: 'Тартар из тунца',
    priceRub: 890,
    weightG: 150,
    budgetFrom: 2000,
    budgetTo: 3000,
    imageUrl: '/vite.svg',
    description: 'Нежный тартар из свежего тунца с авокадо, кунжутом и соевым соусом.'
  },
  {
    id: '8',
    title: 'Пицца Маргарита',
    priceRub: 550,
    weightG: 400,
    budgetFrom: 1000,
    budgetTo: 2000,
    imageUrl: '/vite.svg',
    description: 'Классическая итальянская пицца с томатами, моцареллой и базиликом.'
  },
  {
    id: '9',
    title: 'Утиная грудка',
    priceRub: 1100,
    weightG: 220,
    budgetFrom: 2000,
    budgetTo: 3000,
    imageUrl: '/vite.svg',
    description: 'Утиная грудка с хрустящей кожицей, подаётся с ягодным соусом и гарниром.'
  },
  {
    id: '10',
    title: 'Роллы Филадельфия',
    priceRub: 480,
    weightG: 250,
    budgetFrom: 1000,
    budgetTo: 2000,
    imageUrl: '/vite.svg',
    description: 'Классические роллы с лососем, сливочным сыром и огурцом.'
  }
]

export function getComplimentById(id: string): Compliment | undefined {
  return mockCompliments.find((c) => c.id === id)
}

export function getComplimentIndex(id: string): number {
  return mockCompliments.findIndex((c) => c.id === id)
}
