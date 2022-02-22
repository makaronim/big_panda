import React from 'react';
import './App.css';

const ENDPOINTBASE = "http://localhost:8080";

function App() {

    const [comments, setComments] = React.useState([]);
    const [foundComments, setFoundComments] = React.useState([]);
    const [state, setState] = React.useState({email: '', comment: ''});
    const [commentsLength, setCommentsLength] = React.useState(0);
    React.useEffect(() => {
        getComments();
    }, [commentsLength]);

    const getComments = async () => {
        const data = await fetch(ENDPOINTBASE + '/comments/get')
        const comments = await data.json();
        setComments(comments.msg);
        setFoundComments(comments.msg);
    }
    const onTextChange = (e) => {
        setState({...state, [e.target.name]: e.target.value})
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const {email, comment} = state;
        await fetch(ENDPOINTBASE + '/comments/new', {
            method: 'post', headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json'
            }, body: JSON.stringify({
                email: email, comment: comment
            })
        });
        setCommentsLength(commentsLength + 1);
    }

    const filterComments = (e) => {
        const keyword = e.target.value;
        if (keyword !== '') {
            const res = comments.filter((v) => {
                return v.email.toLowerCase().includes(keyword.toLowerCase()) ||
                    v.comment.toLowerCase().includes(keyword.toLowerCase())
            })
            setFoundComments(res);
        } else {
            setFoundComments(comments)
        }
    }
    const setCommentsSection = foundComments.length > 0 ? foundComments.map((v, i) => {
        return <div className={'comments-wrapper'} key={i}>
            <div className={'single-comment-wrapper'}>
                <div className={'img-holder'}>
                    <img src={v.imgUrl} alt={'avatar'} width={40} height={40}/>
                </div>
                <div className={'text-holder'}>
                    <p><b>{v.email}</b></p>
                    <p>{v.comment}</p>
                </div>
            </div>
        </div>
    }) : <p>No data found</p>;

    return (
        <div className="App">
            <div id={'wrapper'}>
                <div className={'form-holder'}>
                    <form onSubmit={submitHandler}>
                        <div className={'email-holder'}>
                            <input name={'email'} type={"email"}
                                   onChange={e => onTextChange(e)} placeholder={'Email'}
                                   value={state.email}/>
                        </div>
                        <div className={'comment-holder'}>
                            <input name={'comment'} placeholder={"Message"}
                                   onChange={e => onTextChange(e)}
                                   value={state.comment}
                            />
                        </div>
                        <div className={'btn-holder'}>
                            <button type={"submit"}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className={'comments-section'}>
                <div className={'filter-holder'}>
                    <input type={"text"} onChange={e => filterComments(e)} placeholder={'Filter'}/>
                </div>
                <div className={'comments'}>
                    {
                        setCommentsSection
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
