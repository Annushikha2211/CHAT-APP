import React from "react";


function AuthLayout ({children}:AuthLayoutProps){
    return(
        <div>
            <h1>
Chat App
</h1>

{children}
        </div>
    )

}

interface AuthLayoutProps {
children:React.ReactNode
}

export default AuthLayout;