import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from './assets/colors.js';
import {LinearGradient} from 'expo-linear-gradient';
import {Picker} from '@react-native-community/picker';
import {invoiceStatus} from './assets/constants.js'

export default class InvoiceInfoView extends React.Component {
    constructor(props) {
        super(props)
        const invoice = props.invoice
        this.state = {
            name: invoice.name,
            status: invoice.status,
            lineItems: invoice.lineItems,
            totalCost: invoice.totalCost,
            dueDate: invoice.dueDate,
            note: invoice.note,
        }
    }

    renderLineItems = () => {
        const lineItems = this.state.lineItems
        return lineItems.map((item, index) => { return (
            <View style={styles.lineItemRow} key={index}>
                <Text style={styles.lineItemName}>{item.name}</Text>
                <Text style={styles.lineItemCost}>{item.cost} SEK</Text>
            </View>
        )})
    }

    saveAndClose = () => {
        this.props.invoice.status = this.state.status
        this.props.saveInvoiceInfo()
        this.props.closeModal()
    }

    render() {
        const { name, status, lineItems, totalCost, dueDate, note } = this.state

        // Change color of modal depending on invoice status
        let gradientColors = []
        switch (status) {
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
        return(
            <View style={styles.container}>
                <LinearGradient 
                    colors={gradientColors}
                    style={styles.backgroundGradient}
                    >
                    <ScrollView>
                        {/* CLOSE BUTTON */}
                        <TouchableOpacity style={styles.closeModalButton} onPress={() => this.props.closeModal()}>
                            <Icon name="times" size={30} color="#fff"/>
                        </TouchableOpacity>
                        <Text style={styles.title}>Invoice Info</Text>
                        {/* NAME */}
                        <Text style={styles.header}>{name}</Text>
                        <View style={styles.separator}/>

                        {/* LINE ITEMS */}
                        {lineItems.length !== 0 && <View>
                            <Text style={styles.subHeader}>Line Items</Text>
                            {this.renderLineItems()}
                            <View style={styles.separator}/>
                        </View>}

                        {/* TOTAL COST */}
                        <Text style={styles.subHeader}>Total Cost (SEK)</Text>
                        <Text style={styles.infoText}>{totalCost}</Text>
                        <View style={styles.separator}/>

                        {/* DUE DATE */}
                        <Text style={styles.subHeader}>Due Date</Text>
                        <Text style={styles.infoText}>{dueDate.toDateString()}</Text>

                        <View style={styles.separator}/>

                        {/* NOTE */}
                        {!note === '' &&<View>
                            <Text style={styles.subHeader}>Additional Notes</Text>
                            <Text style={styles.infoText}>{note}</Text>
                            <View style={styles.separator}/>
                        </View>}

                    

                        {/* STATUS INPUT */}
                        <Text style={styles.subHeader}>Status</Text>
                        <View style={styles.pickerContainer}>
                            <Picker 
                                selectedValue={status}
                                onValueChange={(value, index) => this.setState({status: value})}
                                style={styles.statusPicker}
                                mode={"dropdown"}
                                itemStyle={styles.statusText}
                            >
                                <Picker.Item label='Outstanding' value={invoiceStatus.OUTSTANDING} />
                                <Picker.Item label='Paid' value={invoiceStatus.PAID} />
                                <Picker.Item label='Late' value={invoiceStatus.LATE} />
                                <Picker.Item label='Canceled' value={invoiceStatus.CANCELED} />
                            </Picker> 

                        </View>
                        <View style={styles.separator}/> 
                        <View style={styles.separator}/>
                        <View style={styles.separator}/>
                        
                        {/* SAVE BUTTON */}
                        <TouchableOpacity 
                            style={[styles.saveButton, {backgroundColor: gradientColors[0]}]} 
                            onPress={() => this.saveAndClose()}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </LinearGradient>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.brightTheme,
        flex: 1,
        marginVertical: 25,
        marginHorizontal: 20,
        
        alignItems: 'center',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,  
        elevation: 10,
    },
    separator: {
        height: 18,
    },
    backgroundGradient: {
        flex: 1,
        borderRadius: 5,
        width: '100%',
        padding: 15,
    },
    closeModalButton: {
        position: 'absolute',
        top: 3,
        right: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.white,
        marginVertical: 24,
        alignSelf: 'center',
    },
    header: {
        fontSize: 26,
        fontWeight: "bold",
        marginHorizontal: 18,
        color: colors.white,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.white,
    },
    saveButton: {
        height: 50,
        width: 130,
        borderRadius: 25,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.theme,
    },
    input: {
        flex: 1,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.white,
        color: colors.black,
        paddingHorizontal: 12,
        paddingVertical: 3,
    },    
    infoText: {
        color: colors.white,
        marginHorizontal: 18,
        fontSize: 18,
        marginBottom: 4,
    },
    subHeader: {
        color: colors.white,
        marginHorizontal: 18,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    lineItemHeader: {
        color: colors.white,
        marginHorizontal: 18,
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    dueDateText: {
        marginRight: 5,
        color: colors.white,
        fontSize: 15,
        fontWeight: "bold",

    },
    statusPicker: {
        width: '100%',
        height: 36,
        backgroundColor: colors.white,
        color: colors.black,
        paddingVertical: 3,
    },
    pickerContainer: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 18,
        marginTop: 4,
        marginHorizontal: 10,
        backgroundColor: colors.white,
        overflow: 'hidden',
    },
    statusText: {
        color: colors.black,
    },
    newLineItemRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 7,
    },
    lineItemRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginHorizontal: 10,
        borderBottomColor: colors.white,
        borderBottomWidth: 1
    },
    lineItemInputContainer: {
        flex: 1,
        marginRight: 7,
    },
    lineItemName: {
        flex: 1,
        textAlign: "left",
        justifyContent: "center",
        color: colors.white,
        
        fontSize: 16,
    },
    lineItemCost: {
        flex: 1,
        textAlign: "right",
        justifyContent: "center",
        color: colors.white,
        
        fontSize: 16,
    },
  });