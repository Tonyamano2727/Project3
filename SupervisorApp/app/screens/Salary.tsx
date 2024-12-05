import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { apiGetEmployeeList, apiGetSalary } from '../config/apiService'; // Make sure to import the API functions
import { Picker } from '@react-native-picker/picker';

const Salary = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [salaries, setSalaries] = useState<any[]>([]);
  const [filteredSalaries, setFilteredSalaries] = useState<any[]>([]);
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('');

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 7 }, (_, i) => (2024 + i).toString());

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await apiGetEmployeeList();
        if (response.data.success) {
          setEmployees(response.data.staff);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const response = await apiGetSalary();
      if (response.data.success) {
        const uniqueSalaries = removeDuplicateSalaries(response.data.data);
        setSalaries(uniqueSalaries);
        setFilteredSalaries(uniqueSalaries);
      }
    } catch (error) {
      console.error('Error fetching salaries:', error);
    }
  };

  const removeDuplicateSalaries = (salaryList: Array<{ employee: any; month: number; year: number; baseSalary: number; commission: number; totalSalary: number; }>) => {
    const uniqueEntries: Array<{ employee: any; month: number; year: number; baseSalary: number; commission: number; totalSalary: number; }> = [];
    const uniqueKeys = new Set();
    
    salaryList.forEach((salary) => {
      const key = `${salary.employee._id}-${salary.month}-${salary.year}`;
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        uniqueEntries.push(salary);
      }
    });
  
    return uniqueEntries;
  };

  const handleFilterChange = () => {
    const filtered = salaries.filter(
      (salary) =>
        (filterMonth ? salary.month === filterMonth : true) &&
        (filterYear ? salary.year === filterYear : true)
    );
    setFilteredSalaries(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [filterMonth, filterYear, salaries]);

  const renderSalaryItem = ({ item }: { item: any }) => (
    <View style={styles.salaryItem}>
      <Text style={styles.text}>Employee: {item.employee?.name}</Text>
      <Text style={styles.text}>Month: {item.month}</Text>
      <Text style={styles.text}>Year: {item.year}</Text>
      <Text style={styles.text}>Base Salary: {item.baseSalary?.toLocaleString()} VND</Text>
      <Text style={styles.text}>Commission: {item.commission?.toLocaleString()} VND</Text>
      <Text style={styles.text}>Total Salary: {item.totalSalary?.toLocaleString()} VND</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salary Management</Text>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <Text style={styles.subtitle}>Filter by Month and Year</Text>

        {/* Month Filter */}
        <View style={styles.pickerWrapper}>
          <Text>Month</Text>
          <Picker
            selectedValue={filterMonth}
            onValueChange={(itemValue) => setFilterMonth(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All" value="" />
            {months.map((month) => (
              <Picker.Item key={month} label={`Month ${month}`} value={month} />
            ))}
          </Picker>
        </View>

        {/* Year Filter */}
        <View style={styles.pickerWrapper}>
          <Text>Year</Text>
          <Picker
            selectedValue={filterYear}
            onValueChange={(itemValue) => setFilterYear(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All" value="" />
            {years.map((year) => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>
        </View>

        <Button title="Apply Filter" onPress={handleFilterChange} />
      </View>

      {/* Salary List */}
      <FlatList
        data={filteredSalaries}
        renderItem={renderSalaryItem}
        keyExtractor={(item) => item._id || item.employee._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  filterSection: {
    marginBottom: 20,
  },
  pickerWrapper: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  salaryItem: {
    padding: 15,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
  },
});

export default Salary;
