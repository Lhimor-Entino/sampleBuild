
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import axios from "axios"
import { FormEventHandler, useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { coookie_options } from "@/config"
import { useNavigate } from "react-router-dom";
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

const Login = () => {

    const [username, setUsername] = useState<string>("d826");
    const [password, setPassword] = useState<string>("Admin@123!?")
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate();


    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setLoading(true)
   
        const user ={
            "username": username,
            "password": password
        }

        try {
            const response = await axios.post(
                "http://192.168.23.84:8007/ddcic/api/v1/credential/login",
                user
            );

            if (response.data.details.token) {
                Cookies.set("jt", response.data.details.token, coookie_options);
                Cookies.set("auto_request","true",coookie_options)
                navigate("/")
            }

        } catch (error : any) {
            console.log(error)

            toast.error('Something went wrong', {
                description: `${error.message}. If error still persist, contact our programmers.`,
              })
        } finally {
            setLoading(false)
        }

    }

    
    
    useEffect(() => {
        if(Cookies.get("jt")) {
            navigate("/")
            return
        };
    },[])


    return (
        <div
            className={cn(
                {
                    'cursor-wait': loading,
                },
                'flex items-center justify-center border h-screen'
            )}>
            <Card className="w-[350px] ">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your login credentials.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="login" onSubmit={onSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Username</Label>
                                <Input id="name" placeholder="Username" autoComplete="nofill" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Password</Label>
                                <Input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>

                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex">

                    <Button form="login" className="w-full bg-red-900 hover:bg-red-900 dark:text-white" type="submit"> {loading ? <div className="flex items-center"><Loader2Icon color={localStorage.getItem("vite-ui-theme") === "dark" ?"#fff" :""} className="w-4 h-4 animate-spin mr-2"/> Logging In ...</div> :"Login" }</Button>
                </CardFooter>
            </Card>
        </div>

    )
}

export default Login