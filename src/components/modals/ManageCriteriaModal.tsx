"use client"

import { useState } from "react"
import { View, Text, Modal, ScrollView, TextInput, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { ManageCriteriaModalProps, GradingCriterion } from "../../interfaces/interface"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"

export function ManageCriteriaModal({ visible, classId, criteria, onSave, onCancel }: ManageCriteriaModalProps) {
  const [localCriteria, setLocalCriteria] = useState<GradingCriterion[]>(criteria)

  const addCriterion = () => {
    const newCriterion: GradingCriterion = {
      id: Date.now().toString(),
      name: "New Criterion",
      weight: 10,
      maxScore: 100,
      description: "",
    }
    setLocalCriteria([...localCriteria, newCriterion])
  }

  const updateCriterion = (id: string, updates: Partial<GradingCriterion>) => {
    setLocalCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const deleteCriterion = (id: string) => {
    setLocalCriteria((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSave = () => {
    const totalWeight = localCriteria.reduce((sum, c) => sum + c.weight, 0)
    if (totalWeight !== 100) {
      alert(`Total weight must equal 100%. Current: ${totalWeight}%`)
      return
    }
    onSave(localCriteria)
  }

  const totalWeight = localCriteria.reduce((sum, c) => sum + c.weight, 0)

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-dark rounded-t-3xl h-5/6">
          <View className="flex-row justify-between items-center p-5 border-b border-dark-border">
            <Text className="text-xl font-bold text-white">Manage Grading Criteria</Text>
            <TouchableOpacity onPress={onCancel}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-5 py-4" showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-sm text-gray-400">
                Total Weight: {totalWeight}% {totalWeight !== 100 && "⚠️"}
              </Text>
              <TouchableOpacity onPress={addCriterion}>
                <Text className="text-sm font-semibold text-primary">+ Add Criterion</Text>
              </TouchableOpacity>
            </View>

            {localCriteria.map((criterion) => (
              <Card key={criterion.id} className="p-4 mb-3">
                <View className="flex-row justify-between items-start mb-3">
                  <TextInput
                    value={criterion.name}
                    onChangeText={(text) => updateCriterion(criterion.id, { name: text })}
                    className="text-base font-bold text-white flex-1 mr-2"
                    placeholder="Criterion Name"
                    placeholderTextColor="#64748b"
                  />
                  <TouchableOpacity onPress={() => deleteCriterion(criterion.id)}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row gap-3 mb-2">
                  <View className="flex-1">
                    <Text className="text-xs text-gray-400 mb-1">Weight (%)</Text>
                    <TextInput
                      value={criterion.weight.toString()}
                      onChangeText={(text) => updateCriterion(criterion.id, { weight: Number.parseInt(text) || 0 })}
                      keyboardType="numeric"
                      className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-gray-400 mb-1">Max Score</Text>
                    <TextInput
                      value={criterion.maxScore.toString()}
                      onChangeText={(text) => updateCriterion(criterion.id, { maxScore: Number.parseInt(text) || 0 })}
                      keyboardType="numeric"
                      className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white"
                    />
                  </View>
                </View>

                <TextInput
                  value={criterion.description}
                  onChangeText={(text) => updateCriterion(criterion.id, { description: text })}
                  placeholder="Description (optional)"
                  placeholderTextColor="#64748b"
                  className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm"
                  multiline
                />
              </Card>
            ))}
          </ScrollView>

          <View className="p-5 border-t border-dark-border">
            <Button title="Save Criteria" onPress={handleSave} icon="checkmark" />
          </View>
        </View>
      </View>
    </Modal>
  )
}
