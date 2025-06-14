import { Client, Databases, ID, Query } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // ✅ Correct endpoint
  .setProject(PROJECT_ID);

const database = new Databases(client);

// ✅ You must pass searchTerm and movie as arguments to this function
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.equal('searchTerm', searchTerm) // ✅ Corrected Query
      ]
    );

    if (result.documents.length > 0) {
      const doc = result.documents[0]; // ✅ Use `documents`, not `document`
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        doc.$id,
        {
          count: doc.count + 1 // ✅ Correct object syntax
        }
      );
    } else {
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    }
  } catch (error) {
    console.error("Error updating search count:", error); // ✅ Correct spelling
  }
};


export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.limit(5),
                Query.orderDesc("count")
            ]
        );
        return result.documents; // Return result if you want to use the data
    } catch (error) {
        console.error("Failed to fetch trending movies:", error);
    }
};
