export default function Test() {    
    return (        
        <>
         <div
            className="mx-auto mt-10 flex"
            style={{
                width: '1440px',
                height: '100vh',
                borderRadius: '32px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#ccc',
                overflow: 'hidden',
            }}
        >
            {/* Left Column */}
            <div
                className="flex flex-col bg-red-500"
                style={{
                    width: '591px',
                    height: '100vh',
                    padding: '32px',
                }}
            >
                {/* Your left column content here */}
            </div>

            {/* Right Column */}
            <div
                className="relative"
                style={{
                    width: '849px',
                    height: '100vh',
                    padding: '12px',
                    marginLeft: '10px', // gap
                }}
            >
                <img
                    src="/images/authPage.jpg"
                    alt="Right Column"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
       
       </>
    )
}