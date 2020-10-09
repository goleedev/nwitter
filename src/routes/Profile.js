import React, { useEffect, useState } from 'react';
import { authService, dbService } from 'fbase';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const Profile = ({ refreshUser, userObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const getMyNweets = async () => {
        await dbService.collection("nweets").where("creatorId", "==", userObj.uid).orderBy("createdAt").get();
    };
    useEffect(() => {
        getMyNweets();
    }, [])

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName,
            })
            refreshUser();
        }
    };

    return (
    <>
        <form onSubmit={onSubmit}>
            <input
                onChange={onChange}
                type="text"
                placeholder="Display Name" 
                value={newDisplayName}
            />    
            <input type="submit" value="Update Profile"/>
        </form>      
        <button onClick={onLogOutClick}>Log Out</button>
    </>
    );
};

export default Profile;