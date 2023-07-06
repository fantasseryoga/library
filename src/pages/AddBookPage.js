import { React, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { useHttp } from '../hooks/http.hook'
import { Footer } from '../components/Footer'
import moment from 'moment'
import "../css/create.scss"


export const AddBookPage = () => {
    const [categories, setCategories] = useState([])
    const [authors, setAuthors] = useState([])
    const [formErrors, setFormErrors] = useState([])
    const { request } = useHttp()
    const [bookCategory, setBookCategory] = useState(1)
    const [bookAuthor, setBookAuthor] = useState(1)
    const [book, setBook] = useState({
        title: "",
        isbn: "",
        category: "",
        author: "",
        active: true
    })
    const bookId = useParams().id

    const formErrorHandler = () => {
        let errors = false
        let formErrorsArr = []
        if (book.title.length <= 1) {
            formErrorsArr.push("Title should contain at least 2 characters")
            errors = true
        }
        if (book.title.length >= 50) {
            formErrorsArr.push("Title should not contain more then 50 characters")
            errors = true
        }
        if (book.isbn.length <= 9) {
            formErrorsArr.push("ISBN should contain at least 10 characters")
            errors = true
        }
        if (book.isbn.length >= 14) {
            formErrorsArr.push("ISBN should not contain more then 13 characters")
            errors = true
        }
        if (book.category === "") {
            formErrorsArr.push("You should select category")
            errors = true
        }
        if (book.author === "") {
            formErrorsArr.push("You should select author")
            errors = true
        }

        if (errors) {
            setFormErrors(formErrorsArr)
            return false
        }

        return true
    }

    const changeHandler = event => {
        setBook({ ...book, [event.target.name]: event.target.value })
    }

    const createHandler = async () => {
        if (!formErrorHandler()) {
            return
        }

        const body = { ...book }
        body.modified = null
        body.createdAt = moment().format()

        const response = await request("/books", "POST", body)

        if (response.ok) {
            alert("Book has been added")
            setFormErrors([])
        }
    }

    const updateHandler = async () => {
        if (!formErrorHandler()) {
            return
        }

        const body = { ...book }
        body.modified = moment().format()

        const response = await request("/books/" + bookId, "PATCH", body)

        if (response.ok) {
            alert("Book has been updated")
            setFormErrors([])
        }
    }

    useEffect(() => {
        request("/authors", "GET").then(data => data.json()).then(authorData => {
            setAuthors(authorData)
        })

        request("/categories", "GET").then(data => data.json()).then(catData => {
            setCategories(catData)
        })
    }, [request])

    useEffect(() => {
        if (bookId) {
            request("/books/" + bookId, "GET").then(data => data.json()).then(bookData => {
                setBook(
                    bookData
                )
                setBookCategory(bookData.category)
                setBookAuthor(bookData.author)
            })
        }
    }, [bookId])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    return (
        <>
            <div className='wrapper'>
                <Navbar />
                <div className='container-create'>
                    <div className='card blue-grey darken-1'>
                        <div className='card-content'>
                            <div className='row'>
                                <div className="input-field col s6">
                                    <input placeholder="Book title" id="title" name="title" type="text" className="validate" defaultValue={book.title} onChange={changeHandler} />
                                    <label htmlFor="title">Title</label>
                                </div>
                                <div className="input-field col s6">
                                    <input placeholder="ISBM" id="isbn" name="isbn" type="text" className="validate" defaultValue={book.isbn} onChange={changeHandler} />
                                    <label htmlFor="isbn">ISBN</label>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="input-field col s6">
                                    <select id='sel' name='author' onChange={changeHandler}>
                                        {
                                            bookId
                                                ?
                                                <option selected key={book.id} value={book.author}>{authors.length ? authors.filter(el => el.id.toString() === bookAuthor.toString())[0].name : ""}</option>
                                                :
                                                <option selected key={0} value={0}>--</option>
                                        }
                                        {
                                            authors.map(el => {
                                                if (el.id.toString() === bookAuthor.toString() && bookId) {
                                                    return
                                                }

                                                return (
                                                    <option key={el.id} value={el.id}>{el.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="input-field col s6">
                                    <select id='sel' name='category' onChange={changeHandler}>
                                        {
                                            bookId
                                                ?
                                                <option selected key={book.id} value={book.category}>{categories.length ? categories.filter(el => el.id.toString() === bookCategory.toString())[0].name : ""}</option>
                                                :
                                                <option selected key={0} value={0}>--</option>
                                        }
                                        {
                                            categories.map(el => {
                                                if (el.id.toString() === bookCategory.toString() && bookId) {
                                                    return
                                                }

                                                return (
                                                    <option key={el.id} value={el.id}>{el.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div>
                                <ul className="collection errors-list">
                                    {
                                        formErrors.map((el, index) => {
                                            return <li key={index} className="collection-item error-item-list">&bull; {el}</li>
                                        })
                                    }
                                </ul>
                            </div>
                            <a className="btn btn-w" onClick={bookId ? updateHandler : createHandler}>
                                {
                                    bookId
                                        ?
                                        "Update"
                                        :
                                        "Create"
                                }
                            </a>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}