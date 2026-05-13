import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { Board } from '@/components/board/board'
import { serializeTask } from '@/lib/serialize-task'
import type { Task } from '@/types/task'

export default async function BoardPage() {
  const session = await auth()
  
  const tasks = await prisma.task.findMany({
    orderBy: [
      {
        priority: 'asc',
      },
      {
        createdAt: 'desc',
      },
    ],
  })

  const serializedTasks = tasks.map(serializeTask) as Task[]

  // Obtener nombre del usuario basado en email
  const userEmail = session?.user?.email || ''
  let userName = 'Invitado'
  
  if (userEmail === 'dannii.ospino@gmail.com') {
    userName = 'Danny'
  } else if (userEmail === 'demo@monarca.co') {
    userName = 'Invitado'
  } else if (userEmail) {
    // Extraer nombre del email (parte antes del @)
    userName = userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1)
  }

  return <Board 
    initialTasks={serializedTasks} 
    userName={userName}
    userEmail={userEmail}
  />
}
