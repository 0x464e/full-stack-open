import {useState} from 'react'

const FeedbackType = {
    GOOD: 1,
    NEUTRAL: 0,
    BAD: -1
}

const FeedbackButton = ({handleClick, text}) => {
    return (
        <button onClick={handleClick}>{text}</button>
    )
}

const StatisticsLine = ({text, value}) => {
    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    )
}

const Statistics = ({all, bad, good, neutral}) => {
    if (all === 0) {
        return (
            <p>No feedback given</p>
        )
    }
    return (
        <div>
            <table>
                <StatisticsLine text="good" value={good}/>
                <StatisticsLine text="neutral" value={neutral}/>
                <StatisticsLine text="bad" value={bad}/>
                <StatisticsLine text="all" value={all}/>
                <StatisticsLine text="average" value={(good - bad) / all}/>
                <StatisticsLine text="positive" value={good / all * 100 + "%"}/>
            </table>
        </div>
    )
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);
    const [all, setAll] = useState(0);

    const handleFeedback = (type) => () => {
        switch (type) {
            case FeedbackType.GOOD:
                setGood(good + 1);
                break;
            case FeedbackType.NEUTRAL:
                setNeutral(neutral + 1);
                break;
            case FeedbackType.BAD:
                setBad(bad + 1);
                break;
        }
        setAll(all + 1);
    }

    return (
        <div>
            <h1>give feedback</h1>
            <FeedbackButton handleClick={handleFeedback(FeedbackType.GOOD)} text="good"/>
            <FeedbackButton handleClick={handleFeedback(FeedbackType.NEUTRAL)} text="neutral"/>
            <FeedbackButton handleClick={handleFeedback(FeedbackType.BAD)} text="bad"/>
            <h1>statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad} all={all}/>
        </div>
    )
}

export default App