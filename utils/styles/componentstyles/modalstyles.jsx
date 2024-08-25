const modalStyles = {
    collection: {},
    onhand: {
        modalContainer: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#283f57',
            borderRadius: '10px',
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
            p: 1
        },
        modalTitle: {
            fontSize: '24px',
            fontWeight: 700
        },
        modalElementBg: {
            paddingLeft: '5px',
            paddingRight: '5px',
            color: 'white',
            borderRadius: '10px',
            backgroundColor: '#1e2f41',
        }
    },
    selectionBox: {
        border: '2px solid turquoise',
        left: '0px',
        top: '-2px',
        widthScaling: {
            width: '99%',
            '@media only screen and (max-width: 850px)': {
                width: '98%'
            },
            '@media only screen and (min-width: 851px) and (max-width: 1149px)': {
                width: '98.5%'
            }
        }
    }
}

export default modalStyles