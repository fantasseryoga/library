import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { AddBookPage } from './pages/AddBookPage'


export const useRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/create" element={<AddBookPage />} />
            <Route path="/create/:id" element={<AddBookPage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}