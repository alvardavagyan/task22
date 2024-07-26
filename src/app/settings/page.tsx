"use client"
import { useActionState } from "react";
import { handleNewLogin } from "../lib/actions";


export default function Settings(){

    const [state, handleNewLoginAction] = useActionState(handleNewLogin, {message:""})


    return (
        <main className="p-4 px-6 mx-6">
          <h1 className="is-size-3">Settings</h1>
          <div className="columns">
            <div className="column is-two-fifths p-4">
              <form className="box" action={handleNewLoginAction}>
                  {state?.message && <p style={{color:'red'}}>{state.message}</p>}
                  <div className="field my-4"> 
                    <div className="field my-4">
                    <input 
                      type="password" 
                      className="input is-dark"
                      placeholder="please enter your password"
                      name="password"
                    />
                  </div>
                  <input 
                      type="text" 
                      className="input is-dark"
                      placeholder="please enter new login"
                      name="login"
                    />
                  </div>
                  <button className="button is-success">save changes</button>
              </form>
            </div>
          </div>
        </main>
      )
}