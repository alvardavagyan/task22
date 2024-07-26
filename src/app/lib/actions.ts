"use server"

import { OptionalUser } from "./types"
import { nanoid } from "nanoid"
import bcrypt from 'bcrypt'
import { addUser, getUserById, getUserByLogin, updateUserLogin } from "./api"
import { redirect } from "next/navigation"
import { createAuthSession, destroySession, verifyAuth } from "./auth"

export const handleSignup = async (prev: unknown, data: FormData) => {

    if (!data.get('name') || !data.get('surname')) {
        return {
            message: "Please fill all the fields"
        }
    }

    const found = getUserByLogin(data.get('login') as string)
    if (found) {
        return {
            message: "Login is busy!"
        }
    }

    const user: OptionalUser = {
        id: nanoid(),
        name: data.get('name') as string,
        surname: data.get('surname') as string,
        login: data.get('login') as string,
    }

    user.password = await bcrypt.hash(data.get('password') as string, 10)
    console.log(addUser(user))
    redirect("/login")

}

export const handleLogin = async (prev: unknown, data: FormData) => {
    if (!data.get('login') || !data.get('password')) {
        return {
            message: "please fill all the fields"
        }
    }

    let login = data.get('login') as string
    let password = data.get('password') as string

    let user = getUserByLogin(login)
    if (!user) {
        return {
            message: "the login is incorrect!"
        }
    }
    let match = await bcrypt.compare(password, user.password)
    if (!match) {
        return {
            message: "password is wrong!!"
        }
    }

    await createAuthSession(user.id)
    redirect("/profile")
}

export const handleLogout = async () => {
    await destroySession()
    redirect("/login")
}


export const handleNewLogin = async (prev: unknown, data: FormData) => {

    const newLogin=data.get("login") as string
    const currentPass=data.get("password") as string

    if(!newLogin || !currentPass){
        return{
            message:"Please fill all the fields."
        }
    }


    const verified=await verifyAuth()
    if(!verified.user){
        return{
            message:"User is not verified."
        }
    }


    const user=await getUserById(verified.user.id)
    if(!user){
        return{
            message:"User not found."
        }
    } 

    
    let match=await bcrypt.compare(currentPass,user.password)
    if(!match){
        console.log("match")
        return {
            message:"Password is wrong."
        }
    }

    const foundNewLogin=await getUserByLogin(newLogin)
    if(foundNewLogin){
        return{
            message:"Login is busy."
        }
    }

    await updateUserLogin(newLogin,user.id)
    await destroySession()
    redirect("/login")
   


    }
    



















