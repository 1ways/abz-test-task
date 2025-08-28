import { useState } from 'react'
import Header from './components/Header'
import Button from './components/Button'
import Cards from './components/Cards'
import Form from './components/Form'
import successImage from "./assets/success-image.svg"


export default function App() {
    // States
    const [users, setUsers] = useState([])
    const [success, setSuccess] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Functions
    function getUsers(page, isReset) {
        setIsLoading(true)

        fetch(`https://frontend-test-assignment-api.abz.agency/api/v1/users?page=${page}&count=6`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`)
                }

                return res.json()
            })
            .then(data => {
                // Set total pages
                setTotalPages(data.total_pages)

                if (isReset) {
                    // Reset users array to the first page
                    setUsers(data.users)
                } else {
                    // Update users array
                    setUsers(prevUsers => [...prevUsers, ...data.users])
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <>
            <Header />
            <main className="main">
                <section className="hero">
                    <div className="hero__inner">
                        <h1 className="title">Test assignment for front-end developer</h1>
                        <p className="hero__text">What defines a good front-end developer is one that has skilled knowledge of HTML, CSS, JS with a vast understanding of User design thinking as they'll be building web interfaces with accessibility in mind. They should also be excited to learn, as the world of Front-End Development keeps evolving.</p>
                        <Button tag="a" type="yellow" href="#signup-form">Sign up</Button>
                    </div>
                </section>
                <div className="container">
                    <section className="section" id="users-form">
                        <h2 className="title title-section">Working with GET request</h2>
                        <Cards
                            users={users}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                            getUsers={getUsers}
                            isLoading={isLoading}
                        />
                    </section>
                    <section className="post section" id="signup-form">
                        <h2 className="title title-section">
                            {success ? "User successfully registered" : "Working with POST request"}
                        </h2>
                        {success ? (
                            <div className="post__success">
                                <img src={successImage} alt="The image shows successful registration" />
                            </div>
                        ) : <Form
                            setSuccess={setSuccess}
                            setCurrentPage={setCurrentPage}
                            getUsers={getUsers}
                        />
                        }
                    </section>
                </div>
            </main>
        </>
    )
}