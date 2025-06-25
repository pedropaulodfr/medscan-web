import React from 'react';
import moment from 'moment/moment';
export default function CardRelatorio({ headers = [], items = [], subTabela = null }) {

    return (
        <div className='stripped'>
            {items.map((value) => {
                return (
                    <>
                        <div className='contentGroup w-100 row p-1 border-bottom'>
                            {headers.map(valor => {
                                if (valor.objectValue.length > 0 && typeof valor.objectValue == "object") {
                                    let novoValor = "";
                                    valor.objectValue.map((objectValue, index) => {
                                        if (value[objectValue]) {
                                            novoValor += index > 0 ? valor.separator + value[objectValue] : value[objectValue]
                                        }
                                    });
                                    value[valor.objectValue] = novoValor;
                                }
                                if (!valor.title) {
                                    return (
                                        <div className={`col-${valor.col}`}>
                                            <p><span className="fw-bold">{valor.value ? `${valor.value}:` : ""} </span>
                                                {valor.prefix && value[valor.objectValue] != "Sem informação" ? valor.prefix : ""}
                                                {valor.formatDate && value[valor.objectValue] &&
                                                    value[valor.objectValue] != "Sem informação" &&
                                                    moment(value[valor.objectValue]).format("DD/MM/YYYY HH:mm:ss")
                                                }
                                                {valor.formatDateSemHora && value[valor.objectValue] &&
                                                    value[valor.objectValue] != "Sem informação" &&
                                                    moment(value[valor.objectValue]).format("DD/MM/YYYY")
                                                }
                                                {!valor.formatDate && !valor.formatDateSemHora && value[valor.objectValue] &&
                                                    value[valor.objectValue] != "Sem informação" &&
                                                    value[valor.objectValue]
                                                }
                                                {valor.sufix && value[valor.objectValue] != "Sem informação" ? valor.sufix : ""}
                                            </p>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className={`col-${valor.col}`}>
                                            <h5 className='m-0 fw-bold'>{valor.value ? valor.value : value[valor.objectValue]}</h5>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                        {subTabela && value[subTabela.nomeArray] &&
                            <div className='contentGroup w-100 row p-1 border-bottom'>
                                <h6 className='m-0 fw-bold py-2'>{subTabela.titleLista ?? ""}</h6>
                                {value[subTabela.nomeArray]?.map(valor => {
                                    return (
                                        <>
                                            {subTabela.headersArray.map(header => {
                                                return (
                                                    <div className={`col-${header.col}`}>
                                                        <p>
                                                            <span className="fw-bold">{header.value ? `${header.value}:` : ""} </span>
                                                            {valor[header.objectValue] ?? ""}
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </>
                                    )
                                })}
                            </div>
                        }
                    </>
                )
            })}
        </div>
    )
}