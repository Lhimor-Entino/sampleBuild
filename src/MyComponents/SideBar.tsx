import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { Sun, Moon, LogOutIcon } from "lucide-react"
import { useTheme } from "./Theme/ThemeProvider"
import { useDispatch } from "react-redux"
import { changeTheme } from "@/reducers/themeReducer"

interface Props{
    logout : () => void;
    themeRef : any
}

const SideBar = (props: Props) => {
    const {logout,themeRef} = props
    const { setTheme } = useTheme()
    const dispatch = useDispatch()

    const handleChangeTheme = (theme:any) => {
        setTheme(theme)
        dispatch(changeTheme({newValue:theme}))
        themeRef.current = theme
    }
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex bg-red-900 dark:bg-transparent" >
    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
    </nav>
    <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleChangeTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleChangeTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleChangeTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="hover:cursor-pointer">
            <LogOutIcon className="h-5 w-5 text-white" onClick={() => logout()} />
            <span className="sr-only">Settings</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">Logout</TooltipContent>
      </Tooltip>

    </nav>
  </aside>
  )
}

export default SideBar