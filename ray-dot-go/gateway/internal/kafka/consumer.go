package kafka

import (
	"context"
	"log"

	"github.com/segmentio/kafka-go"
)

type Consumer struct {
	readers map[string]*kafka.Reader
}

type MessageHandler func(message []byte) error

func NewConsumer(brokers []string, groupID string) (*Consumer, error) {
	return &Consumer{
		readers: make(map[string]*kafka.Reader),
	}, nil
}

func (c *Consumer) StartConsuming(topics []string, handler MessageHandler) error {
	// Create readers for each topic
	for _, topic := range topics {
		reader := kafka.NewReader(kafka.ReaderConfig{
			Brokers:  []string{"localhost:9092"}, // Use the brokers from config
			Topic:    topic,
			GroupID:  "user-service-group",
			MinBytes: 1,    // 1 byte
			MaxBytes: 10e6, // 10MB
		})
		c.readers[topic] = reader

		// Start consuming in a separate goroutine for each topic
		go func(topicName string, r *kafka.Reader) {
			log.Printf("Starting to consume from topic: %s", topicName)
			for {
				msg, err := r.ReadMessage(context.Background())
				if err != nil {
					log.Printf("Error reading message from topic %s: %v", topicName, err)
					continue
				}

				log.Printf("Received message from topic %s: %s", topicName, string(msg.Value))
				if err := handler(msg.Value); err != nil {
					log.Printf("Error handling message from topic %s: %v", topicName, err)
				}
			}
		}(topic, reader)
	}

	// Keep the main goroutine alive
	select {}
}

func (c *Consumer) Close() error {
	for topic, reader := range c.readers {
		if err := reader.Close(); err != nil {
			log.Printf("Error closing reader for topic %s: %v", topic, err)
		}
	}
	return nil
}
