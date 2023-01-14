const Header = ({course}) => {
    return <h1>{course.name}</h1>
}

const Part = ({part}) => {
    return (
        <p>{part.name} {part.exercises}</p>
    )
}

const Content = ({course}) => {
    return (
        <div>
            {course.parts.map(x => <Part part={x} key={x.id}/>)}
        </div>
    )
}

const Total = ({course}) => {
    return (
        <p>Number of exercises {course.parts.map(x => x.exercises).reduce((a, b) => a + b, 0)}</p>
    )
}

const Course = ({course}) => {
    return (
        <div>
            <Header course={course}/>
            <Content course={course}/>
            <Total course={course}/>
        </div>
    )
}

export default Course