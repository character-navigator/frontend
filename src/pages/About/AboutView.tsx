import HeaderView from "../../components/Header/HeaderView"
import { HiArrowSmallRight } from "react-icons/hi2";
import HierarchicalMerging from '../../assets/hierarchical-merging.jpg'
import CharacterExtraction from '../../assets/character-extraction.png'
import React, { useState } from 'react';

import './About.css'

function AboutView(){
    
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [isSecondImageOpen, setIsSecondImageOpen] = useState(false);

    return(

        <div className="background-about">
        <HeaderView pageTitle='About'/>
        <div className="copy-about">
        Character Navigator is an application developed by KTH students <a href="https://github.com/gyuudon3187" className="hyper-link">Daniel Dahlberg </a>
        and <a href="https://github.com/axellokrantz" className="hyper-link">Axel Månson Lokrantz </a> as part of their bachelor thesis project, represents
        a collaborative endeavor with <a href="https://www.bookbeat.com" className="hyper-link">BookBeat </a>, a digital book streaming service. <br/><br/>
        
        The project aims to explore the potential of machine learning in crafting spoiler-free character summaries from E-books based on the user's reading
        progression. LLM's are the primary tool used for character summarization, but other complementary technologies such as 'Named Entity Recognition'
        models are also used. The character summaries are delivered to the user in a five-step process:<br/><br/>

        <HiArrowSmallRight size={19} style={{ marginBottom: '-5.5px' }}/> Identification of characters within the book via Named Entity Recognition model.
        The model used in this project is named bert-large-NER and can be found on <a href="https://www.huggingface.co" className="hyper-link">huggingface.co</a>.
        <br/><br/>

        <HiArrowSmallRight size={19} style={{ marginBottom: '-5.5px' }}/> Partitioning the book into n text chunks, each aligning with the LLM's context window,
        to enable the LLM to generate one character summary per chunk, termed "subsummaries".<br/><br/>

        <img className="img-about" src={HierarchicalMerging} onClick={() => setIsImageOpen(true)}/>
        {isImageOpen && (
            <div className="lightbox" onClick={() => setIsImageOpen(false)}>
            <img className="lightbox-image" src={HierarchicalMerging} />
            </div>
        )}
        
        <HiArrowSmallRight size={19} style={{ marginBottom: '-5.5px' }}/>Employing hierarchical merging to condense the subsummaries corresponding to the user's
        current reading progress into a cohesive summary and thereby avoiding spoilers.<br/><br/>

        <HiArrowSmallRight size={19} style={{ marginBottom: '-5.5px' }}/> Storing generated summaries in a database, accessible through a server implemented in .NET.
        <br/><br/>

        <img className="img-about" src={CharacterExtraction} onClick={() => setIsSecondImageOpen(true)}/> 
        {isSecondImageOpen && (
            <div className="lightbox" onClick={() => setIsSecondImageOpen(false)}>
            <img className="lightbox-image" src={CharacterExtraction} />
            </div>
        )}
        

        <HiArrowSmallRight size={19} style={{ marginBottom: '-5.5px' }}/>When a user is reading an E-book in the user interface (implemented in React) and
        encounters a character they do not remember, they simply click on the character name to open a panel containing a summary of the character retrieved from
        the database.
        
        </div>
        </div>
        
    )
}

export default AboutView