
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import {colors} from './assets/colors.js';
import {LinearGradient} from 'expo-linear-gradient';
import {invoiceStatus} from './assets/constants.js'

export default class InvoiceItem extends React.Component {
    render() {
        
        const { invoice, index } = this.props
        const showDate = invoice.status !== invoiceStatus.PAID && invoice.status !== invoiceStatus.CANCELED
        const statusText = invoice.status === invoiceStatus.LATE ? 'Late': 
            invoice.status === invoiceStatus.PAID ? 'Paid' : 
            invoice.status === invoiceStatus.CANCELED ? 'Canceled' : 'Outstanding'
        
        //Change color depending on invoice status
        let gradientColors = []
        switch (invoice.status) {
            case invoiceStatus.PAID:
                gradientColors = [colors.paidGreen, colors.brightGreen]
                break; 
            case invoiceStatus.LATE:
                gradientColors = [colors.alertRed, colors.brightRed]
                break;
            case invoiceStatus.CANCELED:
                gradientColors = [colors.canceledGray, colors.brightGray]
                break;
            case invoiceStatus.OUTSTANDING:
            default:
                gradientColors = [colors.theme, colors.brightTheme]
                break;
        }
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.props.openInfoModal(invoice, index)}>
                <LinearGradient 
                    colors={gradientColors}
                    style={styles.backgroundGradient}>
                <Text style={styles.name}>{invoice.name}</Text>
                <Text style={styles.totalCost}>{invoice.totalCost} SEK</Text>
                <Text style={styles.status}>{statusText}</Text>
                {showDate && <Text style={styles.dueDate}>Due: {invoice.dueDate.toDateString()}</Text>}
                </LinearGradient>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      flex: 1,
      height: 120,
      borderRadius: 5,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    backgroundGradient: {
        flex: 1,
        borderRadius: 5,
        width: '100%',
        padding: 15,
    },
    rowContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name: {
        fontSize: 21,
        fontWeight: "bold",
        color: colors.white, 
    },
    totalCost: {
        fontSize: 17,
        color: colors.white,
    },
    dueDate: {
        alignSelf: 'flex-end',
        fontSize: 14,
        color: colors.white,
        textAlign: 'left',
    },
    status: {
        alignSelf: 'flex-end',
        fontSize: 14,
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    separator: {
        height: 7,
    },
  });