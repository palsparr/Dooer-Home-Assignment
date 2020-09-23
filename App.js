import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from './assets/colors.js'
import InvoiceItem from './InvoiceItem.js'
import CreateInvoiceView from './CreateInvoiceView.js'
import {invoiceStatus} from './assets/constants.js'
import InvoiceInfoView from './InvoiceInfoView.js';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      invoices: [],
      showCreateInvoiceModal: false,
      showInfoModal: false,
      selectedInvoice: {},
      selectedInvoiceIndex: 0,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.getAsyncStorageData()
  }
  
  getAsyncStorageData = async () => {
    try {
      const valueJSON = await AsyncStorage.getItem('INVOICES');
      if (valueJSON !== null) {
        const value = JSON.parse(valueJSON)
        const invoices = value.map((invoice) => {
          invoice.dueDate = new Date(invoice.dueDate)
          return invoice
        })
        await this.setState({invoices})
      }
    } catch (error) {
      // Error retrieving data
    }
    this.updateInvoiceStatus(false)
    return
  }

  setAsyncStorageData = async (invoices) => {
    try {
      const invoicesJSON = JSON.stringify(invoices)
      await AsyncStorage.setItem('INVOICES', invoicesJSON);
    } catch (error) {
      // Error saving data
    }
  }

  renderInvoice = ({item, index}) => {
    return (
      <InvoiceItem invoice={item} index={index} openInfoModal={this.openInvoiceInfoModal}/>
    )
  }

  renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Invoices</Text>
      </View>
    )
  }

  renderItemSeparator= () => {
    return (
      <View style={styles.separator} />
    )
  }

  renderListEmpty = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.listEmptyText}>No invoices. Click the button to create one</Text>
      </View>
    )
  }

  addInvoice = async (invoice) => {
    //Add new invoice to state and update + save all invoices to local storage
    await this.setState({invoices: [...this.state.invoices, invoice], showCreateInvoiceModal: false})
    this.updateInvoiceStatus(true)
  }

  openInvoiceInfoModal = (invoice, index) => {
    this.setState({showInfoModal: true, selectedInvoice: invoice, selectedInvoiceIndex: index})
  }

  saveInvoiceInfo = () => {
    //Save invoice changes to local storage
    this.setAsyncStorageData(this.state.invoices)
  }

  closeModals = () => {
    this.setState({showCreateInvoiceModal: false, showInfoModal: false, selectedInvoice: {}, selectedInvoiceIndex: 0})
  }

  refreshFlatlist = () => {
    //Refresh to update status of invoices and see if any are late
    this.setState({refreshing: true})
    this.updateInvoiceStatus(false)
    this.setState({refreshing: false})
  }

  updateInvoiceStatus = (saveToStorage) => {
    //Check if any invoices are late
    const today = new Date()
    const invoices = this.state.invoices
    const updatedInvoices = invoices.map((invoice) => {
      if (invoice.status === invoiceStatus.OUTSTANDING) {
        if (invoice.dueDate.getTime() < today.getTime()) {
          saveToStorage = true
          invoice.status = invoiceStatus.LATE
        }
      }
      return invoice
    })

    //Only save to local storage if anything has changed
    if (saveToStorage) {
      this.setAsyncStorageData(invoices)
    }

    this.setState({invoices: updatedInvoices})
  }

  //TODO: Save to and load from local storage
  //TODO: Documentation in-line and clean code
  

  render() {
    const {showCreateInvoiceModal, showInfoModal} = this.state
    return (
      <View style={styles.container}>

        {/* Create Invoice Modal */}
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={showCreateInvoiceModal}
          onRequestClose={this.closeModals}
        >
          <CreateInvoiceView createInvoice={this.addInvoice} closeModal={this.closeModals}/>
        </Modal>

         {/* Invoice Info Modal */}
         <Modal
          animationType={"slide"}
          transparent={true}
          visible={showInfoModal}
          onRequestClose={this.closeModals}
        >
          <InvoiceInfoView saveInvoiceInfo={this.saveInvoiceInfo} invoice={this.state.selectedInvoice} index={this.state.selectedInvoiceIndex} closeModal={this.closeModals}/>
        </Modal>

        <FlatList
          style={styles.list}
          data={this.state.invoices}
          ListHeaderComponent={this.renderHeader}
          ItemSeparatorComponent={this.renderItemSeparator}
          refreshing={this.state.refreshing}
          onRefresh={this.updateInvoiceStatus}
          ListEmptyComponent={this.renderListEmpty}
          renderItem={this.renderInvoice}
          keyExtractor={(item, index) => '' + index}
        />
        {/* Create Invoice Button */}
        <TouchableOpacity 
          style={styles.roundButtonContainer}
          onPress={() => this.setState({showCreateInvoiceModal: true})}
        >
          <Icon name="plus" size={30} color="#fff"/>
        </TouchableOpacity>
        <StatusBar style="auto" />
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 50,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundButtonContainer:  {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.theme,
    alignItems: 'center',
    justifyContent: 'center',
    position: "absolute",
    bottom: 33,
    right: 33,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 10, 
  },
  header: {
    backgroundColor: colors.white,
    flex: 1,
    height: 70,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.black,
  },
  listEmptyText: {
    fontSize: 14,
    color: colors.brightGray,
  },
  list: {
    width: '100%',
    paddingBottom: 20,
  },
  separator: {
    height: 7,
  },
});
