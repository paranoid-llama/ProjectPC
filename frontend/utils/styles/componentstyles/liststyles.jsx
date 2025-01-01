const listStyles = {
    collection: {
        bodyColor: {
            margin: 0,
            padding: '16px',
            backgroundColor: '#1d1c1b',
            borderRadius: '10px',
        },
        tableCell: {
            textAlign: 'center', 
            color: 'white', 
            padding: '1px'
        },
        ballHeaderDiv: {
            divStyles: {
                padding: '3px 16px 0px',
                borderRadius: '10px',
                backgroundColor: '#1e2f41',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            },
            label: {
                padding: 0,
                margin: 0,
                '@media only screen and (max-width: 1100px)': {
                    paddingLeft: '5px'
                }
            }
        },
        textHeader: {
            margin: 0,
            padding: '16px',
            backgroundColor: '#1e2f41',
            borderRadius: '10px'
        },
        alignment: {
            dexNumHeaderAlignment: {
                // '@media only screen and (max-width: 875px)': {
                //     paddingLeft: '12px'
                // }
                position: 'relative', width: '100%'
            },
            numAlignment: {
                // '@media only screen and (max-width: 875px)': {
                //     paddingLeft: '5px'
                // }
                position: 'relative', width: '100%'
            },
            imgAlignment: {
                // '@media only screen and (max-width: 875px)': {
                //     paddingLeft: '0px'
                // },
                // '@media only screen and (min-width: 876px) and (max-width: 1100px)': {
                //     paddingLeft: '5px'
                // }
                position: 'relative', width: '32px', height: '32px'
            },
            checkboxAlignment: {
                display: 'flex',
                flexDirection: 'column',
                padding: '16px'
            }
        },
        indicators: {
            indicatorRowTop: {
                margin: 0,
                display: 'flex',
                justifyContent: 'center',
                position: 'relative'
            },
            indicatorTop: {
                margin: 0,
                position: 'relative',
                width: '100%',
                '@media only screen and (max-width: 1100px)': {
                    marginRight: '20px'
                }
            }, 
            haindicatorTop: {
                top: '-3px'
            },
            indicatorRow: {
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'row',
                position: 'relative',
                width: '100%'
            },
            haindicatorContainer: {
                display: 'flex',
                justifyContent: 'start',
                position: 'relative',
                width: '50%',
                top: '-26px',
                '@media only screen and (max-width: 1100px)': {
                    width: '0%'
                },
                '@media only screen and (min-width: 1101px) and (max-width: 1200px)': {
                    marginRight: '23%'
                },
                '@media only screen and (min-width: 1201px) and (max-width: 1375px)': {
                    marginRight: '30%'
                },
                '@media only screen and (min-width: 1376px)': {
                    marginRight: '40%',
                }
            },
            emindicatorContainer: {
                display: 'flex',
                position: 'relative',
                top: '-26px',
                '@media only screen and (max-width: 1100px)': {
                    justifyContent: 'center',
                    width: '100%'
                },
                '@media only screen and (min-width: 1101px)': {
                    justifyContent: 'end', 
                    width: '50%'
                }
            },
            // tagindicator: {

            // },
            haindicator: {
                fontSize: '14px',
                right: '-2px'
            },
            emindicator: {
                fontSize: '14px',
            }
        }, 
        selectionBox: {
            border: '5px solid turquoise',
            top: '-18px',
            left: '-2px',
            widthScaling: {
                width: '99.3%',
                '@media only screen and (min-width: 0px) and (max-width: 499px)': {
                    width: '98%'
                },
                '@media only screen and (min-width: 500px) and (max-width: 767px)': {
                    width: '98.6%'
                },
                '@media only screen and (min-width: 768px) and (max-width: 850px)': {
                    width: '98.7%'
                },
                '@media only screen and (min-width: 851px) and (max-width: 1000px)': {
                    width: '98.9%'
                },
                '@media only screen and (min-width: 1001px) and (max-width: 1245px)': {
                    width: '99.1%'
                }
            }
        }
    },
    onhand: {
        bodyColor: {
            margin: 0,
            padding: '16px',
            backgroundColor: '#1d1c1b',
            borderRadius: '10px'
        },
        tableCell: {
            textAlign: 'center', 
            color: 'white', 
            padding: '1px',
            height: '72px'
        },
        textHeader: {
            margin: 0,
            padding: '16px',
            backgroundColor: '#1e2f41',
            borderRadius: '10px'
        },
        alignment: {
            dexNumAlignment: {
                // '@media only screen and (min-width: 876px) and (max-width: 1100px)': {
                //     paddingLeft: '8px'
                // },
                // '@media only screen and (max-width: 875px)': {
                //     paddingLeft: '5px'
                // }
                position: 'relative', width: '100%'
            },
            dexNumHeaderAlignment: {
                // '@media only screen and (max-width: 875px)': {
                //     paddingLeft: '12px'
                // }
                position: 'relative', width: '100%'
            },
            genderImgAlignment: {
                // '@media only screen and (max-width: 875px)': {
                //     paddingLeft: '10px'
                // }
                position: 'relative', width: '32px', height: '32px'
            },
            genderlessAlignment: {
                // '@media only screen and (max-width: 800px)': {
                //     paddingLeft: '13px'
                // }
                position: 'relative', width: '100%'
            },
            imgNumAlignment: {
                // '@media only screen and (max-width: 875px)': {
                //     paddingLeft: '0px'
                // },
                // '@media only screen and (min-width: 876px) and (max-width: 1100px)': {
                //     paddingLeft: '5px'
                // }
                position: 'relative', width: '32px', height: '32px'
            },
            textAlignment: {
                // '@media only screen and (max-width: 875px)': {
                //     paddingLeft: '5px'
                // },
                // '@media only screen and (min-width: 876px) and (max-width: 1000px)': {
                //     paddingLeft: '10px'
                // }
                position: 'relative', width: '100%'
            },
            textAlignmentSpaces: {
                // '@media only screen and (max-width: 875px)': {
                //     paddingLeft: '12px'
                // },
                // '@media only screen and (min-width: 876px) and (max-width: 1000px)': {
                //     paddingLeft: '12px'
                // }
                position: 'relative', width: '100%'
            },
            textAlignment2ndWordLonger: {
                // '@media only screen and (max-width: 875px)': {
                //     paddingLeft: '8px'
                // },
                // '@media only screen and (min-width: 876px) and (max-width: 1000px)': {
                //     paddingLeft: '12px'
                // }
                position: 'relative', width: '100%'
            },
            qtyValueAlignment: {
                // '@media only screen and (max-width: 875px)': {
                //     paddingLeft: '12px'
                // }
                position: 'relative', width: '100%'
            }
        },
    }
}

export default listStyles