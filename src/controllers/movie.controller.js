import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Movie} from "../models/movie.model.js";

const getMovies = asyncHandler( async(req, res) => {
    // Extract and default query parameters from the request
    const page = req.query.page ? Number(req.query.page) - 1 : 0;
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const search = req.query.search || "";
    let sort = req.query.sort || "rating";
    let genre = req.query.genre || "All";

    const genreOptions = [
        "Action",
        "Romance",
        "Fantasy",
        "Drama",
        "Crime",
        "Adventure",
        "Thriller",
        "Sci-fi",
        "Music",
        "Family",
    ];
    
    // Prepare genre and sort data for the database query
    genre = genre === "All"
    ? [...genreOptions]
    : genre.split(",");
    
    sort = sort.split(",");

    let sortBy = {}
    if(sort[1]){
        sortBy[sort[0]] = sort[1];
    } else {
        sortBy[sort[0]] = "asc";
    }

    // Define the reusable query filter
    const query = {
        name : {$regex: search, $options: "i"},
        genre : {$in: genre}
    };

    // Execute database queries
    const movies = await Movie.find(query)
    .sort(sortBy)
    .skip(page * limit)
    .limit(limit)

    const total = await Movie.countDocuments(query)

    // Structure and send the final response
    const response = {
        error:false,
        total,
        page:page+1,
        limit,
        genre:genreOptions,
        movies,
    }

    return res
    .status(200)
    .json(new ApiResponse(200 , response, "Fetched movie successfully!!"))
});

export {getMovies};