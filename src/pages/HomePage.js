import { React, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { useHttp } from '../hooks/http.hook'
import { Footer } from '../components/Footer'
import { Empty } from '../components/Empty'
import { BooksTable } from '../components/BooksTable'
import { Loader } from '../components/Loader'
import moment from "moment"
import "../css/home.scss"


const statuses = [
    { id: 1, name: "Active" },
    { id: 2, name: "Deactivated" }
]

export const HomePage = () => {
    const { request } = useHttp()
    const [booksLoaded, setBooksLoaded] = useState(false)
    const [books, setBooks] = useState([])
    const [term, setTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState(term);
    const [form, setForm] = useState({
        status: 0,
        title: ""
    })

    const liveSearch = async () => {
        try {
            const status = form.status != 0 ? "&active=" + (form.status == 1 ? "true" : "false") : ""
            const title = "?title_like=" + form.title
            const url = "/books" + title + status

            await request(url, "GET").then(res => res.json()
            ).then(
                data => {
                    setBooks(data)
                }
            )
        } catch (e) {
            alert("Sorry sth went wrong, try to reload the page.")
        }
    }

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
        if (event.target.value === "") {
            setDebouncedTerm("debounce")
            return
        }
        setDebouncedTerm(event.target.value)
    }

    const changeStatusHandler = async (event) => {
        const bookId = event.target.name
        const book = books.filter(el => el.id.toString() === bookId.toString())[0]
        const newStatus = !book.active
        const modified = moment().format()

        const response = await request("/books/" + bookId, "PATCH", { active: newStatus, modified: modified })

        if (response.ok) {
            alert("Status was updated successfully.")

            setBooks(books.filter(item => {
                if (item.id.toString() === bookId.toString()) {
                    item.active = newStatus
                    item.modified = modified
                }

                return item
            }))
        } else {
            alert("Sorry, sth went wrong, try again.")
        }

    }

    const deleteHandler = async (event) => {
        try {
            let sure = window.confirm("Are you sure you want to delete this book?")
            if (!sure) {
                return
            }

            const bookId = event.target.name
            const response = await request("/books/" + bookId, "DELETE")

            if (response.ok) {
                alert("Book has been deleted.")

                setBooks(books.filter(item => item.id != bookId))
            } else {
                alert("Sorry, sth went wrong, try again.")
            }
        } catch (e) {

        }
    }

    const paginationHandler = (event) => {

    }

    useEffect(() => {
        try {
            request("/books", "GET").then(data => {
                return data.json()
            }).then(booksData => {
                setBooks(booksData)
                setBooksLoaded(true)
            })
        } catch (e) {
            alert("Sth went wrong, refreshing page may help.")
        }
    }, [request])

    useEffect(() => {
        const timer = setTimeout(() => setTerm(debouncedTerm), 1000);
        return () => clearTimeout(timer);
    }, [debouncedTerm])

    useEffect(() => {
        if (term !== '') {
            liveSearch();
        }
    }, [term]);

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    return (
        <>
            <div className='wrapper'>
                <Navbar />
                <div className='page-body'>
                    <div className='container-home'>
                        <div className='card blue-grey darken-1'>
                            <div className='card-content'>
                                <div className='row'>
                                    <div className="input-field col s7">
                                        <input placeholder="Title" id="title" name="title" type="text" className="validate" onChange={changeHandler} />
                                        <label htmlFor="title">Title</label>
                                    </div>
                                    <div className="input-field col s5">
                                        <select id='sel' name='status' onChange={changeHandler}>
                                            <option selected value={0} key={0}>--</option>
                                            {
                                                statuses.map(el => {
                                                    return (
                                                        <option key={el.id} value={el.id}>{el.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container-home'>
                        {
                            !booksLoaded
                                ?
                                <Loader />
                                :
                                <>
                                    <BooksTable books={books} changeStatusHandler={changeStatusHandler} deleteHandler={deleteHandler} />
                                    {
                                        books.length
                                            ?
                                            null
                                            :
                                            <Empty text={"Nothing is here"} />
                                    }
                                </>
                        }
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}