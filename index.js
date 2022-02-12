const axios = require("axios")
const express  = require("express");
const { sortBy, eq } = require("lodash");
const _ = require("lodash");
const app = express()

//We are finally Using The caching Mechanism pROVIDED by Node-cachin modules
const cache = require("./cachingRespo" )

//Adding Swagger
const swaggerUi = require("swagger-ui-express")
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//endpint_1
app.get("/api/ping", (req,res)=>{
    res.status(200).send({
        success:true
    })
})



//we need to separate out the tags from the query string tags and this is helper function
const seprateTags = (allTags)=>{
    for(i=0;i<allTags.length;i++){
        allTags[i] = allTags[i].trim()
     }
     return allTags
}


//this helper function basically add posts in array in such a way that duplicate can be removes
const addAndRemoveDuplicates = (currntPosts, latestPosts) => {
    for (let i = 0; i < latestPosts.length; i++) {
      isThere = false;
      for (let j = 0; j < currntPosts.length; j++) {
            if (_.isEqual(currntPosts[j], latestPosts[i])) {
            isThere = true;
            break;
            }
      }
      if (!isThere) {
        currntPosts.push(latestPosts[i]);
      }
    }
  
    return currntPosts;
  }



//a helper function which helps us to finalize our response according to our need   
const setPosts = (posts, sortt="id", direction="asc")=>{
        if(direction=== "asc") {
            console.log("inside Asc")
            posts.sort((a,b)=>{
                return a[sortt] - b[sortt]
            })
            return posts
        }else{
            console.log("inside Desc")
            posts.sort((a,b)=>(a[sortt] > b[sortt]) ? -1 : 1)
            return posts 
        }

   
  }

//endpoint_2
app.get("/api/posts", cache(20), async (req,res)=>{
    let allPosts =[]
    let finalPosts = []

    if(req.query.tags===undefined){
        return res.status(400).send({error:"tags paramater is must"})
    }

    //seprating tags using our helper function
    const allTags = seprateTags(req.query.tags.split(","))
    const requests = allTags.map((individualTag)=> axios.get("https://api.hatchways.io/assessment/blog/posts?tag=" + individualTag)        
    )
    //concurrent call to api
    try{
    const result = await Promise.all(requests);
    result.map((tagPosts) => {
        allPosts = addAndRemoveDuplicates(allPosts, tagPosts.data.posts);
    });
    }
    catch{
        res.status(500).send({msg:"Something Went Wrong"})
    }

    const sortbyoptions = ['id','likes', 'popularity', 'reads']
    const direction = ['asc', 'desc']

    const rec_sortby = req.query.sortby
    const rec_dir = req.query.direction


//some nasty logic in order to make this work !!!!!
if(rec_sortby === undefined && rec_dir === undefined){
        finalPosts =  setPosts(allPosts,rec_sortby, rec_dir)
        return res.status(200).send({posts:finalPosts})
}else if(rec_sortby === undefined ){
        if(!direction.includes(rec_dir)){
            return res.status(400).send({error:"invalid Direction Parameter"})
        }else{
            finalPosts =  setPosts(allPosts,rec_sortby, rec_dir)
            return res.status(200).send({posts:finalPosts})
        }
}else if(rec_dir === undefined ){
        if(!sortbyoptions.includes(rec_sortby)){
            return res.status(400).send({error:"invalid Sortby Parameter"})
        }else{
            finalPosts =  setPosts(allPosts,rec_sortby, rec_dir)
            return res.status(200).send({posts:finalPosts})
        }
}


if(!sortbyoptions.includes(rec_sortby)){
    return res.status(400).send({error:"invalid Sortby Parameter"})
}
if(!direction.includes(rec_dir)){
    return res.status(400).send({error:"invalid Direction Parameter"})
}


finalPosts =  setPosts(allPosts,rec_sortby, rec_dir)
    return res.status(200).send({posts:finalPosts})
   
})





app.listen(2000, ()=>{
    console.log("the server is runnning on port number 2000")
})