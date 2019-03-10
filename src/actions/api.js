import request from 'superagent'
import { createBreedAndSubBreedList, createNextQuestion, sleep } from '../lib/utils'

export const SET_BREEDLIST = 'SET_BREEDLIST'
export const GAME_STARTED = 'GAME_STARTED'
export const NEXT_QUESTION = 'NEXT_QUESTION'

export const startGame = () => {
    return async (dispatch) => {
        const response = await request('https://dog.ceo/api/breeds/list/all')
        const breedList = createBreedAndSubBreedList(response.body.message)

        dispatch(setBreedList(breedList))
        dispatch(gameStarted(breedList))
    }
}

export const setBreedList = (breedList) => ({
    type: SET_BREEDLIST, payload: breedList
})

export const fetchRandomImageFromBreed = async (breed) => {
    let response 

    // We check to see if the breed is a subbreed
    if(breed.includes('-')){
        // if it is a sub breed the api endpoint is different
        const [subBreed, superBreed] = breed.split('-')
        response = await request(`https://dog.ceo/api/breed/${superBreed}/${subBreed}/images/random`)
    } else {
        response = await request(`https://dog.ceo/api/breed/${breed}/images/random`)
    }
    
    return response.body.message
}

export const gameStarted = (breedList) => ({
    type: GAME_STARTED, payload: breedList
})

export const nextQuestionCreated = (question) => ({
    type: NEXT_QUESTION, payload: question
})

export const nextQuestion = (delay) => {
    return async (dispatch, getState) => {
        const { currentBreeds, correctAnswer } = createNextQuestion(getState().question.currentBreeds)
        const imageUrl = await fetchRandomImageFromBreed(correctAnswer)

        if(delay){
            await sleep(delay)
        }
        
        dispatch(nextQuestionCreated({ currentBreeds, correctAnswer, imageUrl }))
    }
} 