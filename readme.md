






Testing Routes: 

1. Ensuring Tags query parameter Must be there
    localhost:2000/api/posts

2. Not Providing sortby and direction parameter and getting response as the defualt values set for these parameters
    localhost:2000/api/posts?tags=science,tech

3. invalid sortby 
    //not providing any value
    localhost:2000/api/posts?tags=science,tech&sortby=

    //providing values other than id,reads,likes and popularities
    localhost:2000/api/posts?tags=science,tech&sortby=something



4. Invalid direction 

    //not providing any value
    localhost:2000/api/posts?tags=science,tech&direction=

    //providing values other than asc,desc
    localhost:2000/api/posts?tags=science,tech&direction=ascending

5. Invaid sortby, valid direction
    localhost:2000/api/posts?tags=science,tech&direction=asc&sortby=ids

6. Invalid direction, valid sortby
    localhost:2000/api/posts?tags=science,tech&direction=ascenign&sortby=id

7. Both invalid
    localhost:2000/api/posts?tags=science,tech&direction=ascenign&sortby=ids

8. Everythign Valid
    localhost:2000/api/posts?tags=science,tech&direction=desc&sortby=id

