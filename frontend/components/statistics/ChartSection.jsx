import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart, LineChart } from "react-native-gifted-charts";
import { Colors } from '../../constants/colors';
import CustomBarChart from './CustomBarChart';
import CustomRadarView from './CustomRadarView';
import { LinearGradient } from 'expo-linear-gradient';

//Seccion para mostrar los graficos en statistics
import {
    prepareBarData,
    preparePieData,
    prepareLineData,
    prepareRadarData,
    prepareCalendarData,
    getIconForMetricType,
    getColorForMetricType
} from '../../utils/statisticsHelpers';

const WIDTH = Dimensions.get('window').width;

const ChartSection = ({
    activeChartTab,
    barData,
    maxBarValue,
    pieData,
    lineData,
    radarData,
    total,
    statistics
}) => {
    const renderActiveChart = () => {
        switch (activeChartTab) {
            case 'bar':
                return (
                    <View style={styles.chartContainer}>
                        <View style={styles.barChartWrapper}>
                            <CustomBarChart data={barData} maxValue={maxBarValue} />
                        </View>
                    </View>
                );
            case 'pie':
                return (
                    <View style={styles.pieContainer}>
                        <PieChart
                            data={pieData}
                            donut
                            showGradient
                            sectionAutoFocus
                            radius={WIDTH * 0.25}
                            innerRadius={WIDTH * 0.15}
                            innerCircleColor={'#121212'}
                            centerLabelComponent={() => {
                                return (
                                    <View style={styles.centerLabel}>
                                        <Text style={styles.centerLabelText}>Actividad</Text>
                                        <Text style={styles.centerLabelValue}>{total}</Text>
                                    </View>
                                );
                            }}
                        />
                        <View style={styles.legendContainer}>
                            {pieData.map((item, index) => (
                                <View key={index} style={styles.legendItem}>
                                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                                    <Text style={styles.legendText}>{item.name} ({item.text})</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            case 'calendar':
                // Se genera el calendario
                const calendarData = prepareCalendarData(statistics);

                // Se obtiene el mes actual
                const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                ];
                const currentMonth = monthNames[new Date().getMonth()];

                return (
                    <View style={styles.chartContainer}>
                        <Text style={styles.chartSubtitle}>Actividad de {currentMonth}</Text>
                        <View style={styles.calendarContainer}>
                            <View style={styles.calendarHeader}>
                                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
                                    <Text key={index} style={styles.calendarHeaderDay}>{day}</Text>
                                ))}
                            </View>

                            <View style={styles.calendarGrid}>
                                {calendarData.map((day, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.calendarDay,
                                            {
                                                backgroundColor: day.day === null ?
                                                    'transparent' :
                                                    `rgba(29, 185, 84, ${day.intensity})`
                                            }
                                        ]}
                                    >
                                        {day.day !== null && (
                                            <Text style={styles.calendarDayText}>{day.day}</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.calendarLegend}>
                            <Text style={styles.calendarLegendText}>Menos activo</Text>
                            <View style={styles.calendarLegendGradient}>
                                <View style={[styles.calendarLegendStep, { backgroundColor: 'rgba(29, 185, 84, 0.1)' }]} />
                                <View style={[styles.calendarLegendStep, { backgroundColor: 'rgba(29, 185, 84, 0.3)' }]} />
                                <View style={[styles.calendarLegendStep, { backgroundColor: 'rgba(29, 185, 84, 0.5)' }]} />
                                <View style={[styles.calendarLegendStep, { backgroundColor: 'rgba(29, 185, 84, 0.7)' }]} />
                                <View style={[styles.calendarLegendStep, { backgroundColor: 'rgba(29, 185, 84, 0.9)' }]} />
                            </View>
                            <Text style={styles.calendarLegendText}>Más activo</Text>
                        </View>
                    </View>
                );
            case 'radar':
                return (
                    <View style={styles.radarContainer}>
                        <CustomRadarView data={radarData} />
                    </View>
                );
            default:
                return <View />;
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
                style={styles.header}
            >
                <Text style={styles.sectionTitle}>Resumen de actividad</Text>
            </LinearGradient>
            <View style={styles.content}>
                {renderActiveChart()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: WIDTH * 0.9,
        marginVertical: 15,
        backgroundColor: Colors.grayBg,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    header: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.white,
        textAlign: 'center',
    },
    content: {
        padding: 15,
        backgroundColor: Colors.darkGray,
        alignItems: 'center',
    },
    statTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 10,
        textAlign: 'center',
    },
    chartSubtitle: {
        fontSize: 14,
        color: Colors.grayText,
        marginBottom: 10,
        textAlign: 'center',
    },
    chartContainer: {
        paddingVertical: 10,
        alignItems: 'center',
        width: '100%',
    },
    pieContainer: {
        alignItems: 'center',
    },
    radarContainer: {
        alignItems: 'center',
        width: '100%',
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 15,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 5,
    },
    legendColor: {
        width: 15,
        height: 15,
        borderRadius: 7.5,
        marginRight: 5,
    },
    legendText: {
        color: Colors.white,
        fontSize: 12,
    },
    centerLabel: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerLabelText: {
        color: Colors.white,
        fontSize: 14,
    },
    centerLabelValue: {
        color: Colors.white,
        fontSize: 22,
        fontWeight: 'bold',
    },
    calendarContainer: {
        width: WIDTH * 0.8,
        marginTop: 10,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    calendarHeaderDay: {
        color: Colors.white,
        width: (WIDTH * 0.8 - 14) / 7,
        textAlign: 'center',
        fontSize: 12,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    calendarDay: {
        width: (WIDTH * 0.8 - 14) / 7,
        height: (WIDTH * 0.8 - 14) / 7,
        margin: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
    },
    calendarDayText: {
        color: Colors.black,
        fontSize: 10,
        fontWeight: 'bold',
    },
    calendarLegend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    calendarLegendGradient: {
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    calendarLegendStep: {
        width: 15,
        height: 15,
    },
    calendarLegendText: {
        color: Colors.white,
        fontSize: 10,
    },
});

export default ChartSection;
