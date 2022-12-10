import { useEffect, useState } from "react";
import defaultImg from "../assets/user.png";
import ContactContainer from "../style/ContactContainer";
import brand from "../assets/brand.svg"


const Contact = ({ contacts, user, handleContacts }) => {
    const [username, setUserName] = useState()
    const [img, setImg] = useState()
    // const [select, setSelect] = useState()

    useEffect(() => {
        if (user) {
            setUserName(user.username)
            setImg(user.image)
        }
    }, [user])

    const handleSelect = (id) => {
        handleContacts(id)
        // setSelect(id)
    }

    return <>
        {
            username && img && (
                <ContactContainer>
                    <div className="brand">
                        <img src={brand} alt="" />
                        <h3>Chat</h3>
                    </div>
                    <div className="contacts">
                        {contacts?.map((contact, i) => {
                            const member = contact.members[0];
                            return (
                                <div
                                    className={`contact ${contact.select ? "select" : ""}`}
                                    onClick={() => handleSelect(i)}
                                    key={i}
                                >
                                    <div className="avatar">
                                        <div className={`online ${contact.online ? "" : "off"}`} />
                                        <img src={member.image ? `data:image/svg+xml;base64,${member.image}` : defaultImg} alt="" />
                                    </div>
                                    <div className="username">
                                        <h3>{member.username}</h3>
                                    </div>
                                    {contact.unread > 0 && <div className="unread">{contact.unread}</div>}
                                </div>
                            )

                        })}
                    </div>
                    <div className="user">
                        <div className="avatar">
                            <img src={`data:image/svg+xml;base64,${img}`} alt="" />
                        </div>
                        <div className="username">
                            <h3>{username}</h3>
                        </div>
                    </div>
                </ContactContainer >
            )
        }
    </>
}

export default Contact;
