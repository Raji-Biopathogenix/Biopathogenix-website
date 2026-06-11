"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext";
import { loginServices } from "@/services/loginServices";
import { useRouter } from "next/navigation";

import { usePathname } from "next/navigation"
import { useToast } from "@/context/ToastContext";

import ButtonProps from "@/components/common/Button";

export interface UserActiveItem{
  is_active:boolean
    first_name:string
    last_name:string
    status:boolean
}

export default function ActivateUser() {

  const { setShowMainPageLoader,user } = useAuth();
  const pathname = usePathname()
  const router = useRouter();

  const { setToastNotification } = useToast();

  const [result,setResult] = useState<UserActiveItem | null | undefined>(null)

  const ActivateUser = async (uuid: string) => {
    setShowMainPageLoader(true);
    try {
      const response = await loginServices.updateUserStatus(uuid);
      if(response?.status === "success"){
        setResult(response?.result)
      }
    } catch (err: any) {
      setToastNotification({ type: "error", message: err?.message });
      router.push('/access-denied')
    } finally {
      setShowMainPageLoader(false);
    }
  }

  useEffect(() => {
    let uuid = pathname.split("/").pop();

    console.log("uuid===>",user,"<==>",uuid)
    
    if(uuid && user) {
      ActivateUser(uuid)
    }

  }, [user,pathname])







  return (<>
    <div className="max-w-7xl mx-auto px-4 py-8  min-h-screen">
      {!user ? 
      <div className="text-center">
      <ButtonProps   customClass={`w-50 h-11  bg-[#0b2e59] hover:bg-[#0a2246] text-white font-semibold py-2 px-4 rounded text-sm transition-colors disabled:opacity-70 `} btnLable ={"Login"} onClick={() => router.push('/my-account')   }/> </div> :
      result?.is_active ? <p className="text-center"> User has been Activated! </p> : <></>}
    </div>
  </>)
}

