import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider =({children})=>{

const [githubUser,setGithubUser] = useState(mockUser)
const [repos,setRepos] = useState(mockRepos)
const [followers,setFollowers] = useState(mockFollowers)

const [loading,setLoading] = useState(false)
const [requests,setRequests] = useState(0)
const [error,setError] = useState({show:false,msg:''})

const searchGithubUser = async(user)=>{
    toggleError() 
    setLoading(true)
const resp = await axios(`${rootUrl}/users/${user}`)
.catch((err) => console.log(err))
if(resp.data){
    setGithubUser(resp.data);
    const {login,followers_url} = resp.data
    console.log({login})

await Promise.allSettled([
    axios(`${rootUrl}/users/${login}/repos?per_page=100`),
    axios(`${followers_url}?per_page=100`),
]).then((results)=>{
const [repos,followers] = results;
const status = 'fulfilled';
if(repos.status === status){
    setRepos(repos.value.data)
}
if(followers.status === status){
    setFollowers(followers.value.data)
}
setLoading(false)
}).catch((err)=>console.log(err));

}
if(!resp.data){
    setLoading(false)
    toggleError(true,'User not found');
}
checkRequests();
setLoading(false);
}

const checkRequests = ()=>{
    axios(`${rootUrl}/rate_limit`)
    .then(({data})=>{
        let {rate:{remaining}} = data;
        setRequests(remaining);
        if(remaining === 0){
            toggleError(true,'sorry ,you have exceeded your hourly rate limit')
            
        }
    })
    .catch((err)=> console.log(err))
}
const toggleError=(show = false,msg='')=>{
    setError({show,msg})
    console.log(show,msg)
    }

useEffect(()=>checkRequests(),[])

    return(
     <GithubContext.Provider value={{githubUser,repos,followers,requests,error,searchGithubUser,loading}} >
        {children}
    </GithubContext.Provider>
    )
}

export {GithubProvider,GithubContext};