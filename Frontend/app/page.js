import { LoginBox } from 'app/loginbox';
import Image from 'next/image'

export default function Home() {
  return (
    <main className="bg-f4f4f4 min-h-screen flex flex-col justify-center items-center">
    <Image
      src={`/static/PinTheBinIcon.png`} alt="PinTheBin" width="256" height="256" className="w-20 pb-4"/>
    <LoginBox/>
    </main>
  )
}
