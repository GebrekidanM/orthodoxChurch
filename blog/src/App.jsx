import React from 'react'
import Hero from './Layout/Hero'
import About from './Layout/About'
import { Route, Routes } from 'react-router-dom'
import Blog from './page/Blog'
import Layout from './Layout/Layout'
import Register from './page/Register'
import Login from './page/Login'
import PostDetail from './components/PostDetail'
import PostPart from './Layout/PostPart'
import Main from './Dasheboard/main'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={
          <main>
            <Hero/>
            <PostPart/>
            <About/>
          </main>
        }/>
        <Route path='/posts' element={<Blog/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/postdetail/:id' element={<PostDetail/>}/>
        <Route path='/mainadmin' element={<Main/>}/>
      </Route>
    </Routes>
    
  )
}

export default App
