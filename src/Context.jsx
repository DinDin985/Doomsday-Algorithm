import React, {createContext, useState} from "react";

const Context = createContext();

function ContextProvider(props){
    const [maxDays, setMaxDays] = useState(31);
    const [leapYear, setLeapYear] = useState(true);
    const [doomsDay, setdoomsDay] = useState(2);
    const [closestDoomsDay, setClosestDoomsDay] = useState([4, 29, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12]);
    //doomsDays per month: (1/3 or 1/4 on LY), (2/28 or 2/29 on LY), (3/14 Pie Day), 4/4, 6/6, 8/8, 10/10, 12/12, 9/5, 5/9, 7/11, 11/7
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();

    const [input, setInput] = useState({
        month: currentMonth + 1,
        day: currentDay,
        year: currentYear
    });

    const [example, setExample] = useState({
        anchor: {
            year: undefined
        },

        anchorDay:{
            year: undefined
        },

        doomsDay:{
            month: undefined,
            year: undefined
        },
        
        dotw:{
            day: undefined,
            month: undefined,
            year: undefined,
            maxDays: undefined
        }
    });

    const [exampleDisplay, setExampleDisplay] = useState({
        anchor:{
            step1_2: 1,
            step3: 1,
            step4: 1,
            step5: 1,
            step6_7_8: 1,
            step9: 1
        },

        anchorDay:{
            year: 1,
            anchor: 1,
            step1_2: 1,
            step3: [1, 1, 1],
            step4: [1, 1, 1],
            step5: 1,
            step6: 1,
            step7: 1,
            step8: 1,
            step9: 1,
            step10: 1
        },

        doomsDay: [1, 1],

        dotw:{
            date: "1/1/1",
            step1_2: [1, 1, 1],
            step3: [1, 1],
            step4: [1, 1],
            step5_6: 1
        }
    });

    const [toggle, setToggle] = useState({
        anchor: false,
        anchorDay: false,
        finddoomsDay: false,
        dayOfTheWeek: false
    });

    function handleToggle(e){
        const id = e.target.name.split(" ")[0];

        setToggle((prevToggle) =>{
            return {
                ...prevToggle,
                [id]: !prevToggle[id]
            };
        });
    };

    function handleChange(e){ //When user inputs date
        e.preventDefault();
        const userInput = parseInt(e.target.value); //Since the user input will be a string we change it to an int
        changeInput(userInput, e.target.name);
    };

    function handleChangeExample(e){
        e.preventDefault();
        const userInput = parseInt(e.target.value);
        changeExample(userInput, e.target.name);
    }

    function changeInput(userValue, inputChange){ //This is where we determine what value to change
        if(userValue <= 0){
            tooLowCheck(inputChange);
            changeMaxDays(1); //If we don't change the max days then the user can e.g. 999 as the Day
            return; //We want to stop the rest of the function since it'll override the work zeroOrLowerCheck func
        };

        switch(inputChange){ //Validate the user input, change maxDays, check for leap year
            case "month":
                changeMaxDays(userValue, leapYear);
                if(userValue > 12){ //When user inputs 12 or higher
                    tooHighCheck(inputChange);
                    return;
                }
                break;

            case "day":
                if(userValue > maxDays){ //When user inputs an amount of day more than the month has
                    tooHighCheck(inputChange, userValue);
                    return;  
                } 
                break;
            
            case "year":
                setdoomsDay(2);
                if(leapYearCheck(userValue)){
                    setLeapYear(true);
                    changeMaxDays(input.month, true);
                    /*Cant find a workaround for setting the leap year, waiting 
                    for the change, then using that new leap year value
                    that's why I hard coded true and false bools, this kinda defeats the 
                    purpose of state execpt for line 46*/
                } else{
                    setLeapYear(false);
                    changeMaxDays(input.month, false);
                }
                changeAnchorDay(userValue);
                break;

            default:
                break;
        };

        if(leapYear === true){
            setClosestDoomsDay([4, 29, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12]);
        } else{
            setClosestDoomsDay([3, 28, 14, 4, 9, 6, 11, 8, 5, 10, 7, 12]);
        }
        
        setInput((prevInput) =>{ //The actual change
            return {
                ...prevInput,
                [inputChange]: parseInt(userValue)
            };
        });
    };

    function changeExample(userValue, inputChange){
        const splitter = inputChange.split(".");
        const parent = splitter[0];
        const child = splitter[1];
        
        if(userValue <= 0){
            tooLowCheckExample(parent, child);
            return;
        };

        switch(child){
            case "month":
                console.log("tester tesrr")
                if(userValue > 12){
                    tooHighCheckExample(parent, child, userValue);
                    if(parent === "dotw"){
                        changeMaxDaysDOTW(12, example.dotw.year);
                    };
                    return;
                };

                if(parent === "dotw"){
                    changeMaxDaysDOTW(userValue, example.dotw.year);
                };
                
                break;

            case "day":
            
                break;

            case "year":
            
                break;
        }

        setExample((prevExample) =>{
            return {
                ...prevExample,
                [parent] :{
                    ...prevExample[parent],
                    [child]: userValue
                }
            };
        });
    };

    function changeMaxDays(month, leapYearBool = false){ //Each month has a different amount of days it can have
        setMaxDays(() =>{
            switch(month){
                case 1:
                case 3:
                case 7:
                case 8:
                case 10:
                case 12:
                    tooHighCheck("Day", input.day, 31);
                    return 31;
                
                case 4:
                case 5:
                case 6:
                case 9:
                case 11:
                    tooHighCheck("Day", input.day, 30);
                    return 30;

                case 2: //Feb can be 28 or 29 if it's a leap year
                    if(leapYearBool){ 
                        tooHighCheck("Day", input.day, 29);
                        return 29;
                    } else{
                        tooHighCheck("Day", input.day, 28);
                        return 28;
                    };
            };
        });
    };

    function changeMaxDaysDOTW(month, leapYearBool = false){
        setExample((prevExample) =>{
            switch(month){
                case 1:
                case 3:
                case 7:
                case 8:
                case 10:
                case 12:
                    tooHighCheckExample("dotw", "day", example.dotw.day, example.dotw.maxDays);
                    return {
                        ...prevExample,
                        dotw: {
                            ...prevExample.dotw,
                            maxDays: 31
                        }
                    };
                
                case 4:
                case 5:
                case 6:
                case 9:
                case 11:
                    tooHighCheckExample("dotw", "day", example.dotw.day, example.dotw.maxDays);
                    return {
                        ...prevExample,
                        dotw: {
                            ...prevExample.dotw,
                            maxDays: 30
                        }
                    };

                case 2: //Feb can be 28 or 29 if it's a leap year
                    if(leapYearBool){ 
                        tooHighCheckExample("dotw", "day", example.dotw.day, example.dotw.maxDays);
                        return {
                            ...prevExample,
                            dotw: {
                                ...prevExample.dotw,
                                maxDays: 29
                            }
                        };
                    } else{
                        tooHighCheckExample("dotw", "day", example.dotw.day, example.dotw.maxDays);
                        return {
                            ...prevExample,
                            dotw: {
                                ...prevExample.dotw,
                                maxDays: 28
                            }
                        };
                    };

                default:
                    return {
                        ...prevExample
                    };
            };
        });
    };

    function tooLowCheck(inputChange){// Used when user inputs date equal or lower than 0
        setInput((prevInput) =>{
            return {
                ...prevInput,
                [inputChange]: 1
            };
        });        
    };

    function tooLowCheckExample(parent, child){
        setExample((prevExample) =>{
            return {
                ...prevExample,
                [parent] :{
                    ...prevExample[parent],
                    [child]: 1
                }
            };
        });
    }

    function tooHighCheck(inputChange, userInput, mxm = maxDays){// Checks if input is too high
        if(inputChange === "month"){
            setInput((prevInput) =>{
                return {
                    ...prevInput,
                    month: 12
                };
            });

            changeMaxDays(12, input.year);

        } else if(inputChange === "day" && userInput > mxm){
            /*Used when user input invalid day, f.g. user inputs 31 days 
            for the month of april when there can only be 30 max days*/
            setInput((prevInput) =>{
                return {
                    ...prevInput,
                    day: mxm
                };
            });
        };
    };

    function tooHighCheckExample(parent, child, userInput, mxm = example.dotw.maxDays){
        if(child === "month"){
            setExample((prevExample) =>{
                console.log({...prevExample})
                return {
                    ...prevExample,
                    [parent]: {
                        ...prevExample[parent],
                        [child]: 12
                    }
                };
            });
            
            // changeMaxDaysDOTW(12, example.dotw.year);

        } else if(child === "day" && userInput > mxm){
            setExample((prevExample) =>{
                return {
                    ...prevExample,
                    [parent]: {
                        ...prevExample[parent],
                        [child]: mxm
                    }
                };
            });
        };
    };

    function findAnchor(year){
        let anchor = 5* (Math.floor(((year / 100) % 4))) % 7 + 2;
        if(anchor > 6){
            anchor = anchor - 7;
        }
        return anchor;
    };

    function changeAnchorDisplay(year){
        setExampleDisplay((prevDisplay) =>{
            return {
                ...prevDisplay,
                anchor: {
                    step1_2: year,
                    step3: year / 100,
                    step4: Math.floor((year / 100) % 4),
                    step5: 5 * Math.floor((year / 100) % 4),
                    step6_7_8: 5 * Math.floor(((year / 100) % 4)),
                    step9: (5 * Math.floor(((year / 100) % 4))) + 2,
                    step10: mnemonicConverter((5 * Math.floor(((year / 100) % 4))) + 2)
                }
            };
        });
    };

    function findLastTwoDigits(year){
        let yearArray = year.toString().split("");
        let lastTwoDigits;

        if(yearArray.length == 2 || yearArray.length == 1){ //Has to be double = since the variable is still a string
            lastTwoDigits = yearArray[yearArray.length - 1];
        
        } else{
            lastTwoDigits = yearArray[yearArray.length - 2] + yearArray[yearArray.length - 1];

        };

        return lastTwoDigits;
    };

    function findAnchorDay(year){
        let lastTwoDigits = findLastTwoDigits(year);

        let findAnchorDayNum = (Math.floor(Math.floor(lastTwoDigits / 12) + (lastTwoDigits % 12) + Math.floor((lastTwoDigits % 12) / 4) % 7) + findAnchor(year)) % 7;
        
        let anchorDay;
        anchorDay = mnemonicConverter(findAnchorDayNum);
            
        return anchorDay;
    };

    function changeAnchorDayDisplay(year){
        const y = findLastTwoDigits(year);
        const anchor = findAnchor(year);

        setExampleDisplay((prevDisplay) =>{
            return {
                ...prevDisplay,
                anchorDay:{
                    year: year,
                    anchor: anchor,
                    step1_2: y,
                    step3: [(y / 12).toFixed(2), y % 12, ((y % 12) / 4).toFixed(2)],
                    step4: [Math.floor((y / 12).toFixed(2)), Math.floor(y % 12), Math.floor(((y % 12) / 4))],
                    step5: (Math.floor((y / 12)) + Math.floor((y % 12)) + parseInt(Math.floor(((y % 12) / 4)).toFixed(2))),
                    step6: (Math.floor((y / 12)) + Math.floor((y % 12)) + parseInt(Math.floor(((y % 12) / 4)).toFixed(2))) % 7,
                    step7: (Math.floor((y / 12)) + Math.floor((y % 12)) + parseInt(Math.floor(((y % 12) / 4)).toFixed(2))) % 7 + anchor,
                    step8: ((Math.floor((y / 12)) + Math.floor((y % 12)) + parseInt(Math.floor(((y % 12) / 4)).toFixed(2))) % 7 + anchor) % 7,
                    step9: mnemonicConverter(((Math.floor((y / 12)) + Math.floor((y % 12)) + parseInt(Math.floor(((y % 12) / 4)).toFixed(2))) % 7 + anchor) % 7)
                }
            };
        });
    };

    function findDate(){
        const dotw = mnemonicConverter(findDOTW(input.month, input.day, input.year));
        return dotw;
    };

    function findClosestDoomsDay(month, year){
        switch(month){
            case 1:
                if(year % 4 !== 0){
                    return "1/3";
                } else{
                    return "1/4";
                };
            
            case 2:
                if(year % 4 !== 0){
                    return "2/28";
                } else{
                    return "2/29";
                };

            case 3:
                return "3/14";

            case 4:
                return "4/4";

            case 5:
                return "5/9";

            case 6:
                return "6/6";

            case 7:
                return "7/11";

            case 8:
                return "8/8";

            case 9:
                return "9/5";

            case 10:
                return "10/10";

            case 11:
                return "11/7";

            case 12:
                return "12/12";
        };
    };

    function changeClosestDoomsDayDisplay(month, year){
        const closestDoomsDay = findClosestDoomsDay(month, year);
        const closestDoomsDayArray = closestDoomsDay.split("/");
        console.log(closestDoomsDay);
        console.log(closestDoomsDayArray)
        setExampleDisplay((prevDisplay) =>{
            return {
                ...prevDisplay,
                doomsDay: [closestDoomsDayArray[0], closestDoomsDayArray[1]]
            }
        });
    };

    function findDOTW(month, day, year){
        let anchorDay = mnemonicReverter(findAnchorDay(year));
        let doomsDayArray = findClosestDoomsDay(month, year).split("/");
        let doomsDay = parseInt(doomsDayArray[1]); 
        let dotw = (((day - doomsDay) % 7) + anchorDay) % 7;

        dotw < 0 ? dotw = dotw + 7 : dotw;

        return dotw;
    };

    function changeDOTWDisplay(month, day, year){
        const closestDoomsDay = findClosestDoomsDay(month, year);
        const closestDoomsDayArray = closestDoomsDay.split("/");
        const anchorDay = mnemonicReverter(findAnchorDay(year));
        console.log(((day - closestDoomsDayArray[1]) % 7));
        console.log(anchorDay);
        
        setExampleDisplay((prevDisplay) =>{
            return {
                ...prevDisplay,
                dotw: {
                    date: `${month}/${day}/${year}`,
                    step1_2: [day, closestDoomsDayArray[1], anchorDay],
                    step3: [(day - closestDoomsDayArray[1]) % 7, anchorDay],
                    step4: [((day - closestDoomsDayArray[1]) % 7), anchorDay],
                    step5_6: ((day - closestDoomsDayArray[1]) % 7) + anchorDay,

                    step7: (((day - closestDoomsDayArray[1]) % 7) + anchorDay) < 0 ? 
                           ((((day - closestDoomsDayArray[1]) % 7) + anchorDay) % 7) + 7 :
                           ((((day - closestDoomsDayArray[1]) % 7) + anchorDay) % 7),
                           
                    step8: (((day - closestDoomsDayArray[1]) % 7) + anchorDay) < 0 ?
                           mnemonicConverter(((((day - closestDoomsDayArray[1]) % 7) + anchorDay) % 7) + 7) :
                           mnemonicConverter((((day - closestDoomsDayArray[1]) % 7) + anchorDay) % 7)
                }
            };
        });
    };

    function mnemonicConverter(num){
        switch(num){
            case 0:
                return "Sunday";

            case 1:
                return "Monday";

            case 2:
                return "Tuesday";

            case 3:
                return "Wednesday";

            case 4:
                return "Thursday";

            case 5:
                return "Friday";

            case 6:
                return "Saturday";
        };
        
    };

    function mnemonicReverter(day){
        switch(day){
            case "Sunday":
                return 0;
            
            case "Monday":
                return 1;

            case "Tuesday":
                return 2;

            case "Wednesday":
                return 3;

            case "Thursday":
                return 4;

            case "Friday":
                return 5;

            case "Saturday":
                return 6;
        };
    };

    function changeAnchorDay(Year){
        let yearDiff = Year - 2000; //2000 is the baseline year and the yearDiff determines how many days to add
        let leapYearsAmount, leapYears, normalYears, totalDays, preAdjustDay;
        console.log("yearDiff" + yearDiff);

        if(yearDiff <= 0){ //User inputs year below 2000
            yearDiff = Math.abs(yearDiff); //Year diff must be positive

            setdoomsDay((prevDD) =>{
                leapYearsAmount = Math.floor(yearDiff / 4) + 1; 
                /*The +1 is there to adjust for the leap year, 
                since going from 2000 -> 1999 is going from a leap year to a normal year*/

                if(Year === 1996){ //After/during the year 1996 take away extra leap year
                    leapYearsAmount--;
                }

                leapYears = leapYearsAmount * 2;
                normalYears = yearDiff - leapYearsAmount;
                totalDays = (leapYears + normalYears) % 7;
                preAdjustDay = prevDD - totalDays;

                console.log("leapYearsAmount:" + leapYearsAmount);
                console.log("leapYears:" + leapYears);
                console.log("normalYears:" + normalYears);
                console.log("totalDays:" + totalDays);
                console.log("preAdjustDay:" + preAdjustDay);

                //[0,1,2,3,4,5,6]
                if(preAdjustDay < 0){ //Adding 7 represents a cycle
                    return preAdjustDay + 7;
                } else{
                    return preAdjustDay;
                };
            });
            return;
        };

        setdoomsDay((prevDD) =>{
            leapYearsAmount = Math.floor(yearDiff / 4);

            leapYears = leapYearsAmount * 2; 
            //Leap years cause doomsDay to jump two places hence the two e.g. 1999 DD: Sun 2000 DD: Tue

            normalYears = yearDiff;
            //The rest of the normal years are calculated

            totalDays = (normalYears + leapYears) % 7; 
            //7 days will be one full rotation so we really only care about the remainder 

            /*[0,1,2,3,4,5,6]
            Num returned determines element of Array, 
            each num represents a day of the week e.g. 0 = sun, 1 = mon, etc.*/
            preAdjustDay = prevDD + totalDays;

            console.log("leapYearAmount:" + leapYearsAmount);
            console.log("LeapYears:" + leapYears);
            console.log("totalDays:" + totalDays);

            if(preAdjustDay >= 7){
                return preAdjustDay - 7; 
                /*We sub by 7 in order to represent a "loop" 
                E.g. 2 + 5 = 7, 7 doesn't exist in array, 7 - 7 = 0 which does exist*/
            } else{
                return preAdjustDay;
            };
            
        });
    };

    function slideshowPrePlacement(slideshows){
        slideshows.forEach((slideshow) =>{
            const slidesArray = Array.from(slideshow.children);
            const initialHeight = slidesArray[0].getBoundingClientRect().height;
            slideshow.style.height = `${initialHeight}px`;

            slidesArray.forEach((slide, index) =>{
                const slideWidth = slide.getBoundingClientRect().width;
                slide.style.left = slideWidth * index + "px";
            });

        });
    };

    function moveToSlide(slideshow, direction){
        const slidesArray = Array.from(slideshow.children);
        let previousSlidePosition;
        let slideToMove;

        slidesArray.forEach((slide, index) =>{
            const classList = Array.from(slide.classList);
            if(classList.includes("currentSlide")){
                slidesArray[index].classList.toggle("currentSlide");
                previousSlidePosition = index;
            };
        });

        if(direction === "left"){
            slideToMove = slidesArray[previousSlidePosition - 1];
        } else{
            slideToMove = slidesArray[previousSlidePosition + 1];
        };

        slideToMove.classList.toggle("currentSlide");
        const heightToMove = slideToMove.getBoundingClientRect().height;
        const leftToMove = slideToMove.style.left;
        const styles = {
            height: `${heightToMove}px`,
            transform: `translateX(-${leftToMove})`
        };

        Object.assign(slideshow.style, styles);
    };

    function slideshowReset(slideshow){
        const slidesArray = Array.from(slideshow.children);
        slidesArray.map((slide) =>{
            const classList = Array.from(slide.classList);
            if(classList.includes("currentSlide")){
                slide.classList.toggle("currentSlide");
            };
        });
        slideshow.style.transform = "translateX(0)";
        slidesArray[0].classList.toggle("currentSlide");
    };

    function AddSlideButtons(props){
        let classNameLeft = "slideshow-left-btn slideshow-btn";
        let classNameRight = "slideshow-right-btn slideshow-btn";
        if(props.position === "first"){
            classNameLeft += " disabled";
        } else if(props.position === "last"){
            classNameRight += " disabled";
        }

        return (
            <div className="slideshow-btn-container">
                <button 
                    className={classNameLeft}
                    onClick={() => moveToSlide(props.slideshow, "left")}
                >
                    {"< Prev"}
                </button>

                <button 
                    className={classNameRight}
                    onClick={() => moveToSlide(props.slideshow, "right")}
                >
                    {"Next >"}
                </button>
            </div>
        );
    };

    function leapYearCheck(year){
        if(year % 400 === 0){
            return true;
        }

        if(year % 100 === 0 && year % 400 !== 0){
            return false;
        }

        if(year % 4 === 0){
            return true;
        }

        return false;
    };

    return(
        <Context.Provider value={{
            input, 
            setInput, 
            maxDays, 
            changeMaxDays,
            leapYear,
            setLeapYear,
            handleChange,
            findDate,
            toggle,
            handleToggle,
            example,
            findAnchor,
            findAnchorDay,
            findClosestDoomsDay,
            findDOTW,
            exampleDisplay,
            handleChangeExample,
            changeAnchorDisplay,
            changeAnchorDayDisplay,
            changeClosestDoomsDayDisplay,
            changeDOTWDisplay,
            mnemonicConverter,
            slideshowPrePlacement,
            slideshowReset,
            AddSlideButtons
            }}>
            {props.children}
        </Context.Provider>
    );
};

export {ContextProvider, Context};