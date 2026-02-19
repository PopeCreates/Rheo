"use client"

import { useState, useCallback } from "react"
import type { ToastType } from "../interfaces/interface"

interface ToastState {
  visible: boolean
  message: string
  type: ToastType
  showToast: (message: string, type?: ToastType) => void
  hideToast: () => void
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    type: "info",
    showToast: () => {},
    hideToast: () => {},
  })

  const show = useCallback((message: string, type: ToastType = "info") => {
    setToast({ visible: true, message, type, showToast: () => {}, hideToast: () => {} })
  }, [])

  const hide = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }))
  }, [])

  const success = useCallback((message: string) => show(message, "success"), [show])
  const error = useCallback((message: string) => show(message, "error"), [show])
  const info = useCallback((message: string) => show(message, "info"), [show])
  const warning = useCallback((message: string) => show(message, "warning"), [show])

  return {
    toast,
    show,
    hide,
    success,
    error,
    info,
    warning,
  }
}
