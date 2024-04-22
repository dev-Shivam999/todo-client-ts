import  { useState,  useEffect, useRef } from 'react';
import './App.css';
import axios, { AxiosResponse } from 'axios';

interface Todo {
  _id: string;
  title: string;
  isEditable: boolean;
  isActive: boolean;
}

function App(): JSX.Element {
  const [data, setData] = useState<Todo[]>([]);
  const [St, setSt] = useState<boolean>(false);
  const [t, setT] = useState<boolean>(false);
  const inp=useRef<HTMLInputElement|null>(null);

const api=async()=>{
  
  const {data}: AxiosResponse<{data:Todo[]}> =await axios.get("http://localhost:3000/todo/data")
 
  setData(data.data);

}
  


 
  const hand = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
  if (inp.current?.value=="") {
    return
  }else{
    const { data }: AxiosResponse<Post> = await axios.post("http://localhost:3000/todo/get", {
      data: { title: inp.current!.value }


    })

    if (data.success) {
      setSt(st => !st)
      inp.current!.value = ""

    }
  }
}


const del=async(id:string)=>{
  const { data }: AxiosResponse<Post> = await axios.delete(`http://localhost:3000/todo/del/${id}`)
  if (data.success) {
    setData(p=>p.filter(i=>i._id!==id))
    
  }

}


const check=async(o:Todo)=>{
  const { data }: AxiosResponse<Post> = await axios.post(`http://localhost:3000/todo/check`,{
    data:o._id
    })
  if (data.success) {
    setData(p => p.map(i => i == o?{...i,isActive:!i.isActive}:i))

  }

}
const ed=async(o:Todo)=>{
  const { data }: AxiosResponse<Post> = await axios.post(`http://localhost:3000/todo/edit`, {
    data: o._id
  })
  if (data.success) {
    setData(p => p.map(i => i == o ? { ...i, isEditable: !i.isEditable } : i))

  }
}
  const change = (e: React.ChangeEvent<HTMLInputElement>,o:Todo)=>{
  

    setData(p => p.map(i => i == o ? { ...i, title: e.target.value } : i))

}
  const sub = async (e: React.FormEvent<HTMLFormElement>,o:Todo)=>{
    e.preventDefault()
  const { data }: AxiosResponse<Post> = await axios.post(`http://localhost:3000/todo/change`,{
    data:o
  })
  if (data.success) {
    setData(p => p.map(i => i == o ? { ...i, isEditable:false} : i))

  }


}

  useEffect(() => {
    api()
  }, [St])


  return (
    <div className={` ${t ? "bg-black" : "bg-white "}`}>
      <div className={`w-max mx-auto px-3  ${t ? "bg-white text-black" : "bg-black text-white"} font-mono text-5xl`}>
        <nav className='text-center py-4 flex justify-center gap-3 items-center'>Todo App <span onClick={() => setT(t => !t)} className={`block w-5 h-5 rounded-full ${t ? "bg-black" : "bg-white "}`}> </span></nav>
        <form onSubmit={(e) => hand(e)} className='flex justify-center'>
          <input
            type="text"
            ref={inp}
            className="border-2 bg-transparent rounded-lg p-4 m-3"
            placeholder="Enter your todo"
          />
          <button type="submit">Add</button>
        </form>
        <div className= 'cl h-[75vh]  overflow-auto'>
          {data.length > 0 ? (
            <div className='w-max '>
              {data.map((item) => (
                <div key={item._id} className="flex justify-between px-2" >
                  <input
                    type="checkbox"
                    className="border-2"
                    checked={item.isActive}
                    onChange={() => item.isEditable ? null : check(item)}
                  />
                  <form onSubmit={(e) => sub(e, item)}>
                    <input className={`${item.isActive ? 'line-through' : ''} ${item.isEditable ? "" : "outline-none"} mx-4  bg-transparent`} type='text' onChange={(e) => item.isEditable ? change(e, item) : null} value={item.title}
                    />

                  </form>


                  <button onClick={() => item.isActive ? null : ed(item)}>{item.isEditable ? "🖊️" : "📁"}</button>

                  <div
                    onClick={() => item.isEditable ? {} : del(item._id)}
                    className=" cursor-pointer font-extrabold mx-5"
                  >
                    x
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Add todos</div>
          )}
        </div>
      </div>
   </div>
  );
}

export default App;
