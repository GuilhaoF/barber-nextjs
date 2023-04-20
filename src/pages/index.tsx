import Head from "next/head"
import Login from "./login"
export default function Home() {
  return (
    <div>
      <Head>
        <title>BarberPro - Sistema</title>
      </Head>
      <Login />
    </div>
  )
}