import React, {useContext, useState, useEffect} from "react";

import {Context} from "./Context";

export default function App(){
    const {input, 
            handleChange,
            maxDays,
            findDate,
            handleToggle,
            toggle,
            example,
            exampleDisplay,
            findAnchor,
            findAnchorDay,
            findClosestDoomsDay,
            findDOTW,
            handleChangeExample,
            changeAnchorDisplay,
            changeAnchorDayDisplay,
            changeClosestDoomsDayDisplay,
            changeDOTWDisplay,
            mnemonicConverter,
            slideshowPrePlacement,
            slideshowReset,
            AddSlideButtons
            } = useContext(Context);
    
    const [day, setDay] = useState(mnemonicConverter(findDOTW(input.month, input.day, input.year)));
    const slideshowContainers = Array.from(document.getElementsByClassName("slideshow-container"));
    const slideshows = Array.from(document.getElementsByClassName("slideshow"));

    useEffect(() =>{
        slideshowPrePlacement(slideshows);
        // slideshows.forEach((slideshow, slideshowIndex) =>{
        //     const slideshowArray = Array.from(slideshow.children);
        //     console.log(slideshowArray);
        //     console.log(slideshowArray.map((slide) =>{
        //         console.log(<AddSlideButtons slideshow={slideshows[slideshowIndex]} />)
        //         slide.innerHTML += <AddSlideButtons slideshow={slideshows[slideshowIndex]} />;
        //     }));
        // });
    }, [toggle, exampleDisplay]);

    useEffect(() =>{
        function handleResize() {
            slideshows.forEach((slideshow) =>{
                let targetSlide;
                const slidesArray = Array.from(slideshow.children);

                slidesArray.forEach((slide, index) =>{
                    slide.style.width = window.innerWidth;
                    slide.style.left = window.innerWidth * index + "px";
                    if(Array.from(slide.classList).includes("currentSlide")){
                        targetSlide = index;
                    };
                });
                slideshow.style.transform = `translateX(-${window.innerWidth * targetSlide}px)`;
                slideshow.style.height = `${slidesArray[targetSlide].getBoundingClientRect().height}px`;
            });
        };

        window.addEventListener("resize", handleResize);
    }, [toggle]);

    return(
        <section className="doomsday-section-container">
            <div className="introduction white-container">
                <h1 className="title">The Doomsday Algorithm</h1>

                <div className="introduction_description-image-container">
                    <div className="introduction_description-container">
                        <p className="introduction_description">
                            The Doomsday Algorithm is an algorithm that determines the day of the week for a 
                            given day. The algorithm was developed by John Conway, a British mathmatician and 
                            inventor of the Game of Life. 
                        </p>
                        
                        <p className="introduction_description">
                            The doomsday algorithm works through memorising certain
                            days of the year that all share the same day of the week. These are called doomsdays.
                            For example the 4/4, 6/6, 8/8, 10/10, and 12/12 all share the same day of the week no
                            matter the year. John Conway was able to use this method and give consistant correct answers
                            back in under two seconds. He achieved this due to practicing on his computer that was program
                            "to quiz him with random dates every time he logged on."
                        </p>
                    </div>

                    <div className="introduction_image-container">
                        <img className="john-conway-img" src={"john-conway.jpg"}/>
                    </div>
                </div>
                
                
            </div>

            <div className="process step_1 black-container">
                <div className="process_title-underline-description">
                    <h2 className="process_title">Step 1 - Determine the Anchor</h2>
                    <hr/>
                    <p className="process_description">The anchor is the day of the week that all doomsdays share at the beginning of a century. 
                    E.g. The year 2000 anchor is Tuesday. 
                    </p>
                </div>

                <div className="process_subsection">
                    <h3 className="process_subtitle">Anchor Formula</h3>
                    <p className="equation">5*(c mod 4) mod 7 + Tuesday = Anchor</p>
                    <h4 className="process_notes">• Notes for Anchor Formula</h4>
                    <ol>
                        <li>c = [<sup>year</sup>&frasl;<sub>100</sub>].</li>
                        <li>mod, is the remainder after dividing two numbers together. E.g. 4 mod 3 = 1.</li>
                        <li>Tuesday should be represented as a number rather than the actual day. The chart below 
                            represents each day of the week as a number. Tuesday is represented at a 2.
                        </li>
                        <li>If you end with a number with a decimal simply round down.</li>
                    </ol>
                </div>
                
                <div className="process_subsection last-subsection">
                    <h3 className="process_subtitle">Chart of Mnemonic Day Names</h3>
                    <img className="mnemonic-chart" src={"/mnemonic_day_names.PNG"}/>
                </div>

                <div className="example-container">
                    <h3 className="example-title">Example Process</h3>

                    <button name="anchor" 
                        className="anchor-example-btn process-btn" 
                        onClick={handleToggle}>
                        {toggle.anchor ? "Hide" : "Show"} Example Process
                    </button>

                    <div className="example-showcase-container">
                        <div className="example-showcase" style={{display:`${toggle.anchor ? "block": "none"}`}}>
                            <form className="default-form example-form">
                                <h2 className="default-input-title example-input-title">Input Example</h2>
                                
                                <div className="input-container">
                                    <div className="input-label-span-container">
                                        <input
                                            className="default-input example-input"
                                            onChange={handleChangeExample}
                                            type="number"
                                            value={example.anchor.year}
                                            name="anchor.year"
                                        />
                                        <label 
                                            className={example.anchor.year ? 
                                            "default-input-label-filled example-input-label-filled" : 
                                            "default-input-label example-input-label"}>
                                        Year
                                        </label>
                                        <span 
                                            className={example.anchor.year ? 
                                            "default-input-filled-underline input-filled-underline" : 
                                            "default-input-underline input-underline"}>
                                        </span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();

                                        if(example.anchor.year === undefined){
                                            alert("Input must be filled out.");
                                        } else{
                                            if(slideshowContainers[0].style.display === "block"){slideshowReset(slideshows[0])};
                                            changeAnchorDisplay(example.anchor.year);
                                            slideshowContainers[0].style.display = "block";
                                        };

                                    }} 
                                    className="btn-submit example-btn-submit"
                                    type="submit">
                                    Submit
                                </button>
                            </form>
                            
                            <div className="slideshow-container">
                                <div className="slideshow">
                                    <div className="slides currentSlide">
                                        <div className="slides_text-container">
                                            <p>Start with the anchor formula.</p>
                                            <p className="equation">5*(c mod 4) mod 7 + Tuesday = Anchor</p>
                                        </div>
                                        <AddSlideButtons position="first" slideshow={slideshows[0]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Next plug in the information we know and we will use the year&nbsp; 
                                                {exampleDisplay.anchor.step1_2} as our example year.
                                            </p>
                                            <p className="equation">
                                                5*(<span className="bold"><sup>{exampleDisplay.anchor.step1_2}</sup>&frasl;
                                                <sub>100</sub></span> mod 4) mod 7 + Tuesday = Anchor
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[0]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Simplify {exampleDisplay.anchor.step1_2}/100.</p>
                                            <p className="equation">5*(<span className="bold"><sup>{exampleDisplay.anchor.step1_2}</sup>&frasl;
                                                <sub>100</sub></span> mod 4) mod 7 + Tuesday = Anchor
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[0]} />
                                    </div>
                                    
                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Simplify {exampleDisplay.anchor.step3} mod 4.</p>
                                            <p className="equation">5*(<span className="bold">{exampleDisplay.anchor.step3} mod 4</span>) mod 7 + 
                                                Tuesday = Anchor
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[0]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Multiply 5 by {exampleDisplay.anchor.step4}.</p>
                                            <p className="equation"><span className="bold">5*({exampleDisplay.anchor.step4})</span> mod 7 + 
                                                Tuesday = Anchor
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[0]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Simplify {exampleDisplay.anchor.step5} mod 7.</p>
                                            <p className="equation"><span className="bold">{exampleDisplay.anchor.step5} mod 7</span> + 
                                                Tuesday = Anchor
                                            </p>   
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[0]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Round Down {exampleDisplay.anchor.step6_7_8}</p>
                                            <p className="equation"><span className="bold">Round Down ({exampleDisplay.anchor.step6_7_8})</span> + 
                                                Tuesday = Anchor
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[0]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Convert Tuesday to Mnemonic</p>
                                            <p className="equation">{exampleDisplay.anchor.step6_7_8} + 
                                                <span className="bold"> Convert Mnemonic (Tuesday)</span> = Anchor
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[0]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Add {exampleDisplay.anchor.step6_7_8} + 2.</p>
                                            <p className="equation"><span className="bold">{exampleDisplay.anchor.step6_7_8} + 2</span> = Anchor</p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[0]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Convert {exampleDisplay.anchor.step9} to mnemonic.</p>
                                            <p className="equation"><span className="bold">Convert Mnemonic ({exampleDisplay.anchor.step9})</span> = Anchor</p>
                                        </div>

                                        <AddSlideButtons slideshow={slideshows[0]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>{exampleDisplay.anchor.step10} is the anchor.</p>
                                            <p className="equation"><span className="bold">{exampleDisplay.anchor.step10}</span> = Anchor</p>
                                        </div>
                                        <AddSlideButtons position="last" slideshow={slideshows[0]} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
                
            <div className="process step_2 white-container">
                <div className="process_title-underline-description">
                    <h2 className="process_title">Step 2 - Determine the Anchor Day</h2>
                    <hr/>
                    <p className="process_description">The Anchor Day is the day of the week all doomsdays share. E.g On the year 2005 all doomsdays 
                        were on a Monday. That means the 1/3, 2/28, 3/14, 4/4, 5/9 6/6, 7/11 8/8, 9/5, 10/10, 11/7 
                        and the 12/12 were all on a Monday on the year 2005. Conway also made a formula to determine 
                        the anchor day.
                    </p>
                </div>
                
                <div className="process_subsection last-subsection">
                    <h3 className="process_subtitle">Anchor Day Formula</h3>
                    <p className="equation">( [<sup>y</sup>&frasl;<sub>12</sub>] + y mod 12 + [<sup>y mod 12</sup>&frasl;<sub>4</sub>] ) mod 7 + anchor = Anchor Day</p>
                    <h4 className="process_notes">• Notes for Anchor Day Formula</h4>
                    <ol>
                        <li>y = last two digits of given year. E.g. For the year 2055, y = 55.</li>
                        <li>mod, is the remainder after dividing two numbers together. E.g. 4 mod 3 = 1.</li>
                        <li>anchor is found with the step before this one.</li>
                    </ol>
                </div>

                <div className="example-container">
                    <h3 className="example-title">Example Process</h3>
                
                    <button name="anchorDay" className="anchorDay-example-btn process-btn" onClick={handleToggle}>{toggle.anchorDay ? "Hide" : "Show"} Example Process</button>

                    <div className="example-showcase-container">
                        <div className="example-showcase" style={{display:`${toggle.anchorDay ? "block": "none"}`}}>
                            <form className="default-form example-form">
                                <h2 className="default-input-title example-input-title">Input Example</h2>

                                <div className="input-container">
                                    <div className="input-label-span-container">
                                        <input
                                            className="default-input example-input"
                                            onChange={handleChangeExample}
                                            type="number"
                                            value={example.anchorDay.year}
                                            name="anchorDay.year"
                                        />
                                        <label className={example.anchorDay.year ? "default-input-label-filled example-input-label-filled" : "default-input-label example-input-label"}>Year</label>
                                        <span className={example.anchorDay.year ? "default-input-filled-underline input-filled-underline" : "default-input-underline input-underline"}></span>
                                    </div>   
                                </div>

                                <button 
                                    onClick={(e) =>{
                                        e.preventDefault();

                                        if(example.anchorDay.year === undefined){
                                            alert("Input must be filled out.");
                                        } else{
                                            changeAnchorDayDisplay(example.anchorDay.year);
                                            slideshowContainers[1].style.display = "block";
                                        };

                                    }} 
                                    className="btn-submit example-btn-submit" 
                                    type="button">
                                    Submit
                                </button>
                            </form>

                            <div className="slideshow-container">
                                <div className="slideshow">
                                    <div className="slides currentSlide">
                                        <div className="slides_text-container">
                                            <p>Start with anchor day formula</p>
                                            <p className="equation">
                                                ( [<sup>y</sup>&frasl;<sub>12</sub>] + 
                                                y mod 12 + 
                                                [<sup>y mod 12</sup>&frasl;<sub>4</sub>] ) 
                                                mod 7 + anchor = Anchor Day
                                            </p>
                                        </div>
                                        <AddSlideButtons position="first" slideshow={slideshows[1]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Next plug in the information we know, the year {exampleDisplay.anchorDay.year}, 
                                                y is equal to {exampleDisplay.anchorDay.step1_2} and anchor should be solved 
                                                beforehand and is {exampleDisplay.anchorDay.anchor}.
                                            </p>
                                            <p className="equation">
                                                ( [<sup><span className="bold">{exampleDisplay.anchorDay.step1_2}</span></sup>&frasl;<sub>12</sub>] + 
                                                <span className="bold">{exampleDisplay.anchorDay.step1_2}</span> mod 12 + 
                                                [<sup><span className="bold">{exampleDisplay.anchorDay.step1_2}</span> mod 12</sup>&frasl;<sub>4</sub>] ) 
                                                mod 7 + <span className="bold">{exampleDisplay.anchorDay.anchor}</span> = Anchor Day
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[1]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Simplify everything within the brackets.</p>
                                            <p className="equation">
                                                (<span className="bold">[<sup>{exampleDisplay.anchorDay.step1_2}</sup>&frasl;<sub>12</sub>] +
                                                {exampleDisplay.anchorDay.step1_2} mod 12 +
                                                [<sup>{exampleDisplay.anchorDay.step1_2} mod 12</sup>&frasl;<sub>4</sub>]</span>) 
                                                mod 7 + {exampleDisplay.anchorDay.anchor} = Anchor Day
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[1]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Round down all the numbers within the parentheses to the nearest whole number.</p>
                                            <p className="equation">
                                                (<span className="bold">Round Down ({exampleDisplay.anchorDay.step3[0]}) +
                                                Round Down ({exampleDisplay.anchorDay.step3[1]}) +
                                                Round Down ({exampleDisplay.anchorDay.step3[2]})</span>) 
                                                mod 7 + {exampleDisplay.anchorDay.anchor} = Anchor Day
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[1]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Add all the numbers within the parentheses.</p>
                                            <p className="equation">
                                                (<span className="bold">{exampleDisplay.anchorDay.step4[0]} +&nbsp;
                                                {exampleDisplay.anchorDay.step4[1]} +&nbsp;
                                                {exampleDisplay.anchorDay.step4[2]}</span>
                                                ) 
                                                mod 7 + {exampleDisplay.anchorDay.anchor} = Anchor Day
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[1]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Simplify {exampleDisplay.anchorDay.step5} mod 7.</p>
                                            <p className="equation">
                                                <span className="bold">{exampleDisplay.anchorDay.step5} mod 7</span> + {exampleDisplay.anchorDay.anchor} = Anchor Day
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[1]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Add {exampleDisplay.anchorDay.step6} and {exampleDisplay.anchorDay.anchor}.</p>
                                            <p className="equation">
                                                <span className="bold">{exampleDisplay.anchorDay.step6} +&nbsp; 
                                                {exampleDisplay.anchorDay.anchor}</span> = Anchor Day
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[1]} />
                                    </div>
                                
                                    {exampleDisplay.anchorDay.step7 >= 7 &&
                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>If the number is greater than or equal to 7 you must mod the number by 7.</p>
                                            <p className="equation">
                                            <span className="bold">{exampleDisplay.anchorDay.step7} % 7</span> = Anchor Day
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[1]} />
                                    </div>
                                    }
                                    
                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Convert {exampleDisplay.anchorDay.step8} into Mnemonic.</p>
                                            <p className="equation">
                                            <span className="bold">Convert Mnemonic ({exampleDisplay.anchorDay.step8})</span> = Anchor Day
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[1]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>{exampleDisplay.anchorDay.step9} is the anchor day.</p>
                                            <p className="equation">
                                            <span className="bold">{exampleDisplay.anchorDay.step9}</span> = Anchor Day
                                            </p>
                                        </div>
                                        <AddSlideButtons position="last" slideshow={slideshows[1]} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="process step_3 black-container">
                <div className="process_title-underline-description">
                    <h2 className="process_title">Step 3 - Find the Closest Doomsday to the Given Date</h2>
                    <hr/>
                    <p className="process_description">
                        The next step is finding the closests doomsday to the given date. The best and easiest
                        way to do this is to match the given date's month to the month's doomsday. Also remember to
                        check if the year is a leap year.
                        E.g. Given Date: 6/14/2022 Closest Doomsday: 6/6
                    </p>
                </div>
                
                <div className="process_subsection last-subsection">
                    <h3 className="process_subtitle">Doomsday List</h3>
                    <img className="doomsday-list" src={"/doomsday_list.PNG"} alt="Full list of doomsdays"/>
                    <h4 className="process_notes">• Notes for Doomsday List</h4>
                    <ol>
                        <li>On leap years two dates are altered, January's doomsday becomes the 4th 
                        and February's becomes the 29th.</li>
                    </ol>
                </div>

                <div className="example-container">
                    <h3 className="example-title">Example Process</h3>
                
                    <button name="findDoomsDay" className="findDoomsday-example-btn process-btn" onClick={handleToggle}>{toggle.findDoomsDay ? "Hide" : "Show"} Example Process</button>

                    <div className="example-showcase-container">
                        <div className="example-showcase-example-btn" style={{display:`${toggle.findDoomsDay ? "block": "none"}`}}>
                            <form className="default-form example-form">
                                <h2 className="default-input-title example-input-title">Input Example</h2>
                                
                                <div className="input-container">
                                    <div className="input-label-span-container">
                                        <input
                                            className="default-input example-input"
                                            onChange={handleChangeExample}
                                            type="number"
                                            value={example.doomsDay.month}
                                            name="doomsDay.month"
                                        />
                                        <label className={example.doomsDay.month ? "default-input-label-filled example-input-label-filled" : "default-input-label example-input-label"}>Month</label>
                                        <span className={example.doomsDay.month ? "default-input-filled-underline input-filled-underline" : "default-input-underline input-underline"}></span>
                                    </div>
                                    
                                    <div className="input-label-span-container">
                                        <input
                                            className="default-input example-input"
                                            onChange={handleChangeExample}
                                            type="number"
                                            value={example.doomsDay.year}
                                            name="doomsDay.year"
                                        />
                                        <label className={example.doomsDay.year ? "default-input-label-filled example-input-label-filled" : "default-input-label example-input-label"}>Year</label>
                                        <span className={example.doomsDay.year ? "default-input-filled-underline input-filled-underline" : "default-input-underline input-underline"}></span>
                                    </div>
                                </div>

                                <button 
                                    onClick={(e) =>{
                                        e.preventDefault();

                                        if(example.doomsDay.month === undefined || example.doomsDay.year === undefined){
                                            alert("Input must be filled out.");
                                        } else{
                                            changeClosestDoomsDayDisplay(example.doomsDay.month, example.doomsDay.year);
                                            document.getElementsByClassName("single-card")[0].style.display = "block";
                                        };

                                    }}
                                    className="btn-submit example-btn-submit" 
                                    type="submit">
                                    Submit
                                </button>
                            </form>
                            <div className="single-card">
                                <div className="slides_text-container">
                                    <p>Match the given month's date to the month's doomsday.</p>
                                    <p className="equation">
                                        The closest doomsday from 6/(N/A)/3346 is <span className="bold">{exampleDisplay.doomsDay[0]}/{exampleDisplay.doomsDay[1]}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="process step_4 white-container">
                <div className="process_title-underline-description">
                    <h2 className="process_title">Step 4 - Solve for Day of the Week</h2>
                    <hr/>
                    <p className="process_description">The Day of the Week formula or DOTW for short is a 
                    formula that requires everything from the previous steps. This includes the anchor, anchor
                    day, and closest doomsday to the given date.
                    </p>
                </div>

                <div className="process_subsection last-subsection">
                    <h3 className="process_subtitle">DOTW Formula</h3>
                    <p className="equation">(([G - D] mod 7) + Anchor Day) mod 7 = Day</p>
                    <h3 className="process_subtitle">DOTW Formula if End Result is Negative</h3>
                    <p className="equation">((([G - D] mod 7) + Anchor Day) mod 7) + 7 = Day</p>
                    <h4 className="process_notes">Note for Day of the Week Formula</h4>
                    <ol>
                        <li>G is the given year's day date. E.g. 4/26/2004, G = 26</li>
                        <li>D is the closest Doomsday's day date. E.g. 4/26/2004, closest doomsday would be the 4/4. D = 4</li>
                    </ol>
                </div>

                <div className="example-container">
                    <h3 className="example-title">Example Process</h3>
                
                    <button name="dayOfTheWeek" className="dayOfTheWeek-example-btn process-btn" onClick={handleToggle}>{toggle.dayOfTheWeek ? "Hide" : "Show"} Example Process</button>

                    <div className="example-showcase-container">
                        <div className="example-showcase" style={{display:`${toggle.dayOfTheWeek ? "block": "none"}`}}>
                            <form className="default-form example-form">
                                <h2 className="default-input-title example-input-title">Input Example</h2>
                                
                                <div className="input-container">
                                    <div className="input-label-span-container">
                                        <input
                                            className="default-input example-input"
                                            onChange={handleChangeExample}
                                            type="number"
                                            value={example.dotw.month}
                                            name="dotw.month"
                                        />
                                        <label className={example.dotw.month ? "default-input-label-filled example-input-label-filled" : "default-input-label example-input-label"}>Month</label>
                                        <span className={example.dotw.month ? "default-input-filled-underline input-filled-underline" : "default-input-underline input-underline"}></span>
                                    </div>

                                    <div className="input-label-span-container">
                                        <input
                                            className="default-input example-input"
                                            onChange={handleChangeExample}
                                            type="number"
                                            value={example.dotw.day}
                                            name="dotw.day"
                                        />
                                        <label className={example.dotw.day ? "default-input-label-filled example-input-label-filled" : "default-input-label example-input-label"}>Day</label>
                                        <span className={example.dotw.day ? "default-input-filled-underline input-filled-underline" : "default-input-underline input-underline"}></span>
                                    </div>
                                
                                    <div className="input-label-span-container">
                                        <input
                                            className="default-input example-input"
                                            onChange={handleChangeExample}
                                            type="number"
                                            value={example.dotw.year}
                                            name="dotw.year"
                                        />
                                        <label className={example.dotw.year ? "default-input-label-filled example-input-label-filled" : "default-input-label example-input-label"}>Year</label>
                                        <span className={example.dotw.year ? "default-input-filled-underline input-filled-underline" : "default-input-underline input-underline"}></span>
                                    </div>
                                </div>

                                <button 
                                    onClick={(e) =>{
                                        e.preventDefault();

                                        if(example.dotw.day === undefined ||
                                            example.dotw.month === undefined || 
                                            example.dotw.year === undefined
                                        ){
                                            alert("Input must be filled out.");
                                        } else{
                                            changeDOTWDisplay(example.dotw.day, example.dotw.month, example.dotw.year);
                                            slideshowContainers[2].style.display = "block";
                                        };

                                    }} 
                                    className="btn-submit example-btn-submit"
                                    type="submit">
                                    Submit
                                </button>
                            </form>

                            <div className="slideshow-container">
                                <div className="slideshow">
                                    <div className="slides currentSlide">
                                        <div className="slides_text-container">
                                            <p>Start with day of the week formula.</p>
                                            <p className="equation">(([G - D] mod 7) + Anchor Day) mod 7 = Day</p>
                                        </div>
                                        <AddSlideButtons position="first" slideshow={slideshows[2]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Next plug in the information we know, {exampleDisplay.dotw.date}.</p>
                                            <p className="equation">
                                                ((<span className="bold">{exampleDisplay.dotw.step1_2[0]} -&nbsp;
                                                {exampleDisplay.dotw.step1_2[1]}</span>) mod 7 +&nbsp;
                                                <span className="bold">{exampleDisplay.dotw.step1_2[2]}</span>) mod 7 = Day
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[2]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Subtract {exampleDisplay.dotw.step1_2[0]} by {exampleDisplay.dotw.step1_2[1]}.</p>
                                            <p className="equation">
                                                ((<span className="bold">{exampleDisplay.dotw.step1_2[0]} -&nbsp;
                                                {exampleDisplay.dotw.step1_2[1]}</span>) mod 7 +&nbsp; 
                                                {exampleDisplay.dotw.step1_2[2]}) mod 7 = Day
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[2]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Simplify {exampleDisplay.dotw.step3[0]} mod 7.</p>
                                            <p className="equation">
                                                (<span className="bold">({exampleDisplay.dotw.step3[0]}) mod 7</span> +&nbsp; 
                                                {exampleDisplay.dotw.step3[1]}) mod 7 = Day
                                            </p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[2]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Add {exampleDisplay.dotw.step4[0]} and {exampleDisplay.dotw.step4[1]}.</p>
                                            <p className="equation">
                                            <span className="bold">({exampleDisplay.dotw.step4[0]} +&nbsp; 
                                                {exampleDisplay.dotw.step4[1]})</span> mod 7 = Day</p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[2]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Simplify {exampleDisplay.dotw.step5_6} mod 7.</p>
                                            <p className="equation"><span className="bold">{exampleDisplay.dotw.step5_6} mod 7</span> = Day</p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[2]} />
                                    </div>

                                    {exampleDisplay.dotw.step5_6 < 0 && <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Since {exampleDisplay.dotw.step5_6} is less than 0 we must add a 7 to the equation.</p>
                                            <p className="equation"><span className="bold">{exampleDisplay.dotw.step5_6} + 7</span> = Day</p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[2]} />
                                    </div>}

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>Convert {exampleDisplay.dotw.step7} into mnemonic.</p>
                                            <p className="equation"><span className="bold">Convert Mnemonic ({exampleDisplay.dotw.step7})</span> = Day</p>
                                        </div>
                                        <AddSlideButtons slideshow={slideshows[2]} />
                                    </div>

                                    <div className="slides">
                                        <div className="slides_text-container">
                                            <p>{exampleDisplay.dotw.date} is on a {exampleDisplay.dotw.step8}.</p>
                                            <p className="equation"><span className="bold">{exampleDisplay.dotw.step8}</span> = Day</p>
                                        </div>
                                        <AddSlideButtons position="last" slideshow={slideshows[2]} />
                                    </div>
                                </div>
                            </div>
                        </div>   
                    </div>          
                </div>
            </div>

            <div className="doomsday-alg-container black-container">
                <div className="process_title-underline-description">
                    <h2 className="process_title">Doomsday Algorithm Calculator</h2>
                    <hr/>
                    <p className="process_description">This is here if you only want to know the answer.</p>
                </div>

                <form className="default-form doomsday-alg-form">
                    <h2 className="default-input-title doomsday-alg-input-title">Doomday Algorithm Calculator</h2>
                    
                    <div className="input-container">
                        <div className="input-label-span-container">
                            <input 
                                className="default-input doomsday-alg-input"
                                onChange={handleChange} 
                                type="number" 
                                value={input.month}
                                min="1" 
                                max="12" 
                                name="month"
                            />
                            <label className={input.month ? "default-input-label-filled doomsday-alg-input-label-filled" : "default-input-label doomsday-alg-input-label"}>Month</label>
                            <span className={input.month ? "default-input-filled-underline input-filled-underline" : "default-input-underline input-underline"}></span>
                        </div>
                        
                        <div className="input-label-span-container">
                            <input 
                                className="default-input doomsday-alg-input"
                                onChange={handleChange} 
                                type="number" 
                                value={input.day}
                                min="1" 
                                max={maxDays}
                                name="day"
                            />
                            <label className={input.day ? "default-input-label-filled doomsday-alg-input-label-filled" : "default-input-label doomsday-alg-input-label"}>Day</label>
                            <span className={input.day ? "default-input-filled-underline input-filled-underline" : "default-input-underline input-underline"}></span>
                        </div>
                        
                        <div className="input-label-span-container">
                            <input 
                                className="default-input doomsday-alg-input"
                                onChange={handleChange} 
                                type="number" 
                                value={input.year}
                                min="1" 
                                name="year"
                            />
                            <label className={input.year ? "default-input-label-filled doomsday-alg-input-label-filled" : "default-input-label doomsday-alg-input-label"}>Year</label>
                            <span className={input.year ? "default-input-filled-underline input-filled-underline" : "default-input-underline input-underline"}></span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={(e) =>{
                            e.preventDefault();
                            setDay(findDate(input.month, input.day, input.year));
                        }}
                        className="btn-submit doomsdayALG-btn"
                        type="submit">
                        Submit
                    </button>
                </form>
                <h2 className="doomsday-alg-answer">{`${input.month}/${input.day}/${input.year} is a ${day}`}</h2>
            </div>
        </section>
    );
};