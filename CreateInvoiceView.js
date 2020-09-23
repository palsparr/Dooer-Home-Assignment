import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from './assets/colors.js';
import {LinearGradient} from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import {invoiceStatus} from './assets/constants.js'

export default class CreateInvoiceView extends React.Component {
    constructor(props) {
        super(props)
        const today = new Date()
        const defaultDueDate = new Date(today)
        defaultDueDate.setDate(defaultDueDate.getDate() + 14)
        this.state = {
            name: '',
            note: '',
            lineItems: [],
            totalCost: '',
            dueDate: defaultDueDate,
            status: invoiceStatus.OUTSTANDING,
            showDatePicker: false,
            lineItemName: '',
            lineItemCost: '',
        }
    }

    onDueDateSet = (event, date) => {
        if (event.type !== 'set') {
            this.setState({showDatePicker: false})
            return
        }
        this.setState({dueDate: date, showDatePicker: false})
    }

    addLineItem = () => {
        //Add new line item to line items array and clear input fields
        const lineItems = this.state.lineItems
        const item = {
            name: this.state.lineItemName,
            cost: this.state.lineItemCost,
        }
        this.setState({lineItems: [...lineItems, item], lineItemName: '', lineItemCost: ''})
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

    createNewInvoice = () => {
        //Create invoice object from input fields and add the new invoice to the existing list of invoices
        const { name, note, lineItems, totalCost, dueDate, status } = this.state
        const invoice = {
            name: name.trim(),
            note: note.trim() || '',
            lineItems,
            totalCost: totalCost.trim(),
            dueDate,
            status,
        }
        this.props.createInvoice(invoice)
        this.setState({
            name: '',
            note: '',
            lineItems: [],
            totalCost: '',
            dueDate: new Date(),
            status: invoiceStatus.OUTSTANDING,
            showDatePicker: false,
            lineItemName: '',
            lineItemCost: '',
        })
    }

    stringNotEmpty = (str) => {
        return str.length !== 0 && str.trim()
    }

    render() {
        const { showDatePicker, name, note, totalCost, dueDate, lineItemName, lineItemCost } = this.state
        
        return(
            <View style={styles.container}>
                <LinearGradient 
                    colors={[colors.theme, colors.brightTheme]}
                    style={styles.backgroundGradient}
                    >
                    <ScrollView>
                        <TouchableOpacity style={styles.closeModalButton} onPress={() => this.props.closeModal()}>
                            <Icon name="times" size={30} color="#fff"/>
                        </TouchableOpacity>
                        <Text style={styles.title}>Create new invoice</Text>
                        <View style={styles.separator}/>

                        {/* NAME INPUT */}
                        <Text style={styles.descriptorText}>Name *</Text>
                        <TextInput
                            autoCapitalize={'sentences'}
                            autoCompleteType={'off'}
                            autoCorrect={false}
                            value={name}
                            style={styles.input}
                            onChangeText={(value) => this.setState({name: value})}
                        />
                        <View style={styles.separator}/>

                        {/* LINE ITEMS INPUT */}
                        <Text style={styles.descriptorText}>Line Items</Text>
                        {this.renderLineItems()}
                        <View style={styles.newLineItemRow}>
                            <View style={styles.lineItemInputContainer}>
                                {/* LINE ITEM NAME */}
                                <Text style={styles.lineItemHeader}>Item</Text>
                                <TextInput
                                    autoCapitalize={'sentences'}
                                    autoCompleteType={'off'}
                                    autoCorrect={false}
                                    value={lineItemName}
                                    style={styles.lineItemInput}
                                    onChangeText={(value) => this.setState({lineItemName: value})}
                                />
                            </View>
                            <View style={styles.lineItemInputContainer}>
                                {/* LINE ITEM COST */}
                                <Text style={styles.lineItemHeader}>Cost (SEK)</Text>
                                <TextInput
                                    autoCapitalize={'none'}
                                    autoCompleteType={'off'}
                                    keyboardType={"number-pad"}
                                    autoCorrect={false}
                                    value={lineItemCost}
                                    style={styles.lineItemInput}
                                    onChangeText={(value) => this.setState({lineItemCost: value})}
                                />
                            </View>
            
                            <TouchableOpacity onPress={() => {this.addLineItem()}} disabled={!this.stringNotEmpty(lineItemName) || !this.stringNotEmpty(lineItemCost)}>
                                <Icon name="plus-circle" size={40} color={colors.white} style={{marginTop: 16}} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.separator}/>

                        {/* TOTAL COST INPUT */}
                        <Text style={styles.descriptorText}>Total Cost (SEK)*</Text>
                        <TextInput
                            autoCapitalize={'none'}
                            autoCompleteType={'off'}
                            keyboardType={"number-pad"}
                            autoCorrect={false}
                            value={totalCost}
                            style={styles.input}
                            onChangeText={(value) => this.setState({totalCost: value})}
                        />

                        <View style={styles.separator}/>

                        {/* DUE DATE INPUT */}
                        <Text style={styles.descriptorText}>Due Date *</Text>
                        <TouchableOpacity style={styles.calendarButton} onPress={() => this.setState({showDatePicker: true})}>
                            <Text style={styles.dueDateText}>{dueDate.toDateString()}</Text>
                            <Icon name="calendar" size={20} color="#fff"/>
                        </TouchableOpacity>
                        {showDatePicker && 
                            <DateTimePicker 
                                value={dueDate}
                                onChange={this.onDueDateSet}
                            />}

                        <View style={styles.separator}/>

                        {/* NOTE INPUT */}
                        <Text style={styles.descriptorText}>Additional Notes</Text>
                        <TextInput
                            autoCapitalize={'sentences'}
                            autoCompleteType={'off'}
                            autoCorrect={true}
                            value={note}
                            multiline
                            numberOfLines={4}
                            style={styles.noteInput}
                            onChangeText={(value) => this.setState({note: value})}
                        />
                        <View style={styles.separator}/>

                        <TouchableOpacity 
                            style={styles.doneButton} 
                            disabled={!this.stringNotEmpty(name) || !this.stringNotEmpty(totalCost)}
                            onPress={() => this.createNewInvoice()}>
                            <Text style={styles.whiteHeader}>Create</Text>
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
        marginTop: 24,
        alignSelf: 'center',
    },
    whiteHeader: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.white,
    },
    doneButton: {
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
    noteInput: {
        textAlignVertical: 'top',
        borderRadius: 18,
        backgroundColor: colors.white,
        color: colors.black,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    lineItemInput: {
        flex: 1,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.white,
        color: colors.black,
        paddingHorizontal: 12,
        paddingVertical: 3,
    },
    descriptorText: {
        color: colors.white,
        marginHorizontal: 18,
        fontSize: 14,
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
    calendarButton: {
        marginLeft: 16,
        flexDirection: 'row',
    },
    dueDateText: {
        marginRight: 5,
        color: colors.white,
        fontSize: 15,
        fontWeight: "bold",

    },
    statusPicker: {
        flex: 1,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.white,
        color: colors.black,
        paddingHorizontal: 12,
        paddingVertical: 3,
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