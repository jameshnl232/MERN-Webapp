import { useLocation } from "react-router-dom"
import { useEffect } from "react"

type Props = {}

export default function ScrollToTop({}: Props) {
  
  const path = useLocation().pathname

  useEffect(() => {
    window.scrollTo(0, 0)

  }, [path])

  return null

}