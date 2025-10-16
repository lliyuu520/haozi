import React, {createContext, useCallback, useContext, useState} from 'react'
import type {RouteObject} from 'react-router-dom'
import {generateRoutes} from '@/utils/route'
import type {SysMenu} from '@/types/sys/menu'
import {updateDynamicRoutes} from '@/router'

interface DynamicRoutesContextType {
  dynamicRoutes: RouteObject[]
  updateRoutes: (menus: SysMenu[]) => void
  isRoutesReady: boolean
}

const DynamicRoutesContext = createContext<DynamicRoutesContextType>({
  dynamicRoutes: [],
  updateRoutes: () => {},
  isRoutesReady: false,
})

export const useDynamicRoutes = () => useContext(DynamicRoutesContext)

interface DynamicRoutesProviderProps {
  children: React.ReactNode
}

export const DynamicRoutesProvider: React.FC<DynamicRoutesProviderProps> = ({ children }) => {
  const [dynamicRoutes, setDynamicRoutes] = useState<RouteObject[]>([])
  const [isRoutesReady, setIsRoutesReady] = useState(false)

  const updateRoutes = useCallback((menus: SysMenu[]) => {
    const generatedRoutes = generateRoutes(menus)
    setDynamicRoutes(generatedRoutes)
    setIsRoutesReady(true)
    updateDynamicRoutes(generatedRoutes)
  }, [])

  const value = {
    dynamicRoutes,
    updateRoutes,
    isRoutesReady,
  }

  return (
    <DynamicRoutesContext.Provider value={value}>
      {children}
    </DynamicRoutesContext.Provider>
  )
}