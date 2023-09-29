import { LoginBox } from 'app/loginbox';

export default function Home() {
  return (
    <main className="bg-f4f4f4 min-h-screen flex flex-col justify-center items-center">
    <img src='https://cdn.discordapp.com/attachments/1147171902792671362/1157154034566840380/PinTheBinIcon_7-transformed.png?ex=6517932c&is=651641ac&hm=917aebbc53598b5dc99f7a46d48cfb938d0cb8fb20a973366f0582ab33643ff5&' alt="PinTheBin" className="w-20 pb-4"/>
    <LoginBox/>
    </main>
  )
}
